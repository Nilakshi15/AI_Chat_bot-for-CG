from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: str

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: str
    created_at: str

class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    message_id: str
    user_id: str
    role: str
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class McqQuestion(BaseModel):
    question: str
    options: List[str]
    type: str  # 'single' or 'multiple'

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    message_id: str
    suggested_options: Optional[List[str]] = None
    mcq_question: Optional[McqQuestion] = None

class CareerProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    profile_id: str
    user_id: str
    interests: List[str] = []
    skills: List[str] = []
    experience_level: str = "beginner"
    preferred_industries: List[str] = []
    updated_at: str

class Roadmap(BaseModel):
    model_config = ConfigDict(extra="ignore")
    roadmap_id: str
    user_id: str
    career_title: str
    description: str
    steps: List[dict]
    resources: List[dict]
    created_at: str

# ==================== AUTH HELPER ====================

async def get_current_user(request: Request, session_token: Optional[str] = Cookie(None)) -> User:
    """Authenticator helper - checks cookie first, then Authorization header"""
    token = session_token
    
    # Fallback to Authorization header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session in database
    session_doc = await db.user_sessions.find_one(
        {"session_token": token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry with timezone awareness
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Convert datetime to string if needed
    if isinstance(user_doc.get("created_at"), datetime):
        user_doc["created_at"] = user_doc["created_at"].isoformat()
    
    return User(**user_doc)

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Process session_id from Emergent Auth"""
    try:
        body = await request.json()
        session_id = body.get("session_id")
        
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id required")
        
        # Call Emergent Auth API
        async with httpx.AsyncClient() as client:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_id}
            )
            
            if auth_response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session_id")
            
            auth_data = auth_response.json()
        
        # Generate user_id
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        
        # Check if user exists by email
        existing_user = await db.users.find_one(
            {"email": auth_data["email"]},
            {"_id": 0}
        )
        
        if existing_user:
            user_id = existing_user["user_id"]
            # Update user data
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "name": auth_data["name"],
                    "picture": auth_data["picture"]
                }}
            )
        else:
            # Create new user
            user_doc = {
                "user_id": user_id,
                "email": auth_data["email"],
                "name": auth_data["name"],
                "picture": auth_data["picture"],
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(user_doc)
        
        # Create session
        session_token = auth_data["session_token"]
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        session_doc = {
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.user_sessions.insert_one(session_doc)
        
        # Set httpOnly cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=7*24*60*60
        )
        
        # Return user data
        user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        return {"user": user, "session_token": session_token}
        
    except Exception as e:
        logger.error(f"Session creation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_me(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get current user from session"""
    user = await get_current_user(request, session_token)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response, session_token: Optional[str] = Cookie(None)):
    """Logout user"""
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# ==================== CHAT ROUTES ====================

@api_router.post("/chat/send", response_model=ChatResponse)
async def send_chat_message(
    chat_request: ChatRequest,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    """Send a message to AI mentor and get response"""
    user = await get_current_user(request, session_token)
    
    # Generate conversation_id if not provided
    conversation_id = chat_request.conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
    
    # Store user message
    user_message_id = f"msg_{uuid.uuid4().hex[:12]}"
    user_message_doc = {
        "message_id": user_message_id,
        "user_id": user.user_id,
        "conversation_id": conversation_id,
        "role": "user",
        "content": chat_request.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(user_message_doc)
    
    # Get conversation history
    history = await db.chat_messages.find(
        {"user_id": user.user_id, "conversation_id": conversation_id},
        {"_id": 0}
    ).sort("timestamp", 1).limit(20).to_list(20)
    
    # Call AI using emergentintegrations
    try:
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=conversation_id,
            system_message="""You are an expert AI Career Mentor helping students discover careers, 
            build skills, and create personalized learning roadmaps. Be encouraging, insightful, 
            and provide actionable advice. When discussing careers, mention required skills, 
            typical responsibilities, growth potential, and learning resources.
            
            After providing your response, if relevant, suggest 2-3 follow-up questions or topics 
            the user might want to explore. Format these as simple, clear options."""
        ).with_model("openai", "gpt-5.2")
        
        user_msg = UserMessage(text=chat_request.message)
        ai_response = await chat.send_message(user_msg)
        
        # Decide if we should ask an MCQ question
        mcq_question = None
        message_count = len(history)
        
        # Ask MCQ questions at strategic points in conversation
        if message_count == 0:  # First message - ask about interests
            mcq_question = {
                "question": "What areas interest you the most?",
                "options": [
                    "Technology & Software",
                    "Creative Arts & Design",
                    "Business & Finance",
                    "Healthcare & Medicine",
                    "Education & Teaching",
                    "Engineering"
                ],
                "type": "multiple"
            }
        elif message_count == 2 and any(word in chat_request.message.lower() for word in ['tech', 'software', 'data', 'ai']):
            mcq_question = {
                "question": "What's your current experience level?",
                "options": [
                    "Complete Beginner",
                    "Some Basic Knowledge",
                    "Intermediate (1-2 years)",
                    "Advanced (3+ years)"
                ],
                "type": "single"
            }
        elif message_count == 4 and 'roadmap' in chat_request.message.lower():
            mcq_question = {
                "question": "How much time can you dedicate to learning per week?",
                "options": [
                    "1-5 hours",
                    "5-10 hours",
                    "10-20 hours",
                    "20+ hours (Full-time)"
                ],
                "type": "single"
            }
        elif any(word in chat_request.message.lower() for word in ['skill', 'learn']):
            mcq_question = {
                "question": "Which skills would you like to focus on?",
                "options": [
                    "Technical/Hard Skills",
                    "Soft Skills (Communication, Leadership)",
                    "Industry-Specific Knowledge",
                    "Project Management",
                    "All of the above"
                ],
                "type": "multiple"
            }
        
        # Extract suggested options from AI response if present
        suggested_options = []
        if len(history) <= 2 and not mcq_question:  # Only if not showing MCQ
            # Analyze user's question and provide relevant options
            message_lower = chat_request.message.lower()
            if any(word in message_lower for word in ['career', 'job', 'profession', 'what should i']):
                suggested_options = [
                    "Tell me about tech careers",
                    "Show creative career paths",
                    "Explore business careers"
                ]
            elif any(word in message_lower for word in ['skill', 'learn', 'study']):
                suggested_options = [
                    "Create a learning roadmap",
                    "What skills are in-demand?",
                    "How long does it take?"
                ]
            elif any(word in message_lower for word in ['roadmap', 'path', 'steps']):
                suggested_options = [
                    "Generate a detailed roadmap",
                    "Show me example projects",
                    "Recommend learning resources"
                ]
            else:
                suggested_options = [
                    "Explore career options",
                    "Build a skills roadmap",
                    "Ask about specific careers"
                ]
        
    except Exception as e:
        logger.error(f"AI chat error: {e}")
        ai_response = "I'm having trouble connecting right now. Please try again in a moment."
        suggested_options = []
        mcq_question = None
    
    # Store AI response
    ai_message_id = f"msg_{uuid.uuid4().hex[:12]}"
    ai_message_doc = {
        "message_id": ai_message_id,
        "user_id": user.user_id,
        "conversation_id": conversation_id,
        "role": "assistant",
        "content": ai_response,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(ai_message_doc)
    
    return ChatResponse(
        response=ai_response,
        conversation_id=conversation_id,
        message_id=ai_message_id,
        suggested_options=suggested_options,
        mcq_question=mcq_question
    )

@api_router.get("/chat/history")
async def get_chat_history(
    request: Request,
    session_token: Optional[str] = Cookie(None),
    conversation_id: Optional[str] = None
):
    """Get chat history for user"""
    user = await get_current_user(request, session_token)
    
    if conversation_id:
        # Get specific conversation
        messages = await db.chat_messages.find(
            {"user_id": user.user_id, "conversation_id": conversation_id},
            {"_id": 0}
        ).sort("timestamp", 1).to_list(1000)
        return {"messages": messages}
    else:
        # Get all conversations (grouped)
        pipeline = [
            {"$match": {"user_id": user.user_id}},
            {"$sort": {"timestamp": -1}},
            {"$group": {
                "_id": "$conversation_id",
                "last_message": {"$first": "$$ROOT"},
                "message_count": {"$sum": 1}
            }},
            {"$sort": {"last_message.timestamp": -1}},
            {"$limit": 50}
        ]
        conversations = await db.chat_messages.aggregate(pipeline).to_list(50)
        return {"conversations": conversations}

# ==================== CAREER ROUTES ====================

@api_router.get("/careers/explore")
async def explore_careers(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get curated career paths across industries"""
    user = await get_current_user(request, session_token)
    
    # Curated career data
    careers = [
        {
            "id": "career_1",
            "title": "Software Engineer",
            "category": "Technology",
            "description": "Design, develop, and maintain software applications and systems.",
            "skills": ["Programming", "Problem Solving", "Algorithms", "Teamwork"],
            "growth_potential": "High",
            "avg_salary": "$95,000 - $150,000"
        },
        {
            "id": "career_2",
            "title": "Data Scientist",
            "category": "Technology",
            "description": "Analyze complex data to help companies make better decisions.",
            "skills": ["Python", "Statistics", "Machine Learning", "SQL"],
            "growth_potential": "Very High",
            "avg_salary": "$100,000 - $160,000"
        },
        {
            "id": "career_3",
            "title": "UX/UI Designer",
            "category": "Creative",
            "description": "Create intuitive and beautiful user experiences for digital products.",
            "skills": ["Design Tools", "User Research", "Prototyping", "Empathy"],
            "growth_potential": "High",
            "avg_salary": "$75,000 - $130,000"
        },
        {
            "id": "career_4",
            "title": "Digital Marketing Manager",
            "category": "Business",
            "description": "Plan and execute marketing campaigns across digital channels.",
            "skills": ["SEO/SEM", "Analytics", "Content Strategy", "Communication"],
            "growth_potential": "High",
            "avg_salary": "$70,000 - $120,000"
        },
        {
            "id": "career_5",
            "title": "Registered Nurse",
            "category": "Healthcare",
            "description": "Provide patient care and support in hospitals and healthcare facilities.",
            "skills": ["Patient Care", "Medical Knowledge", "Communication", "Compassion"],
            "growth_potential": "Very High",
            "avg_salary": "$65,000 - $95,000"
        },
        {
            "id": "career_6",
            "title": "Financial Analyst",
            "category": "Business",
            "description": "Analyze financial data to guide business investment decisions.",
            "skills": ["Excel", "Financial Modeling", "Analysis", "Attention to Detail"],
            "growth_potential": "High",
            "avg_salary": "$70,000 - $110,000"
        },
        {
            "id": "career_7",
            "title": "Content Creator",
            "category": "Creative",
            "description": "Create engaging content for social media, blogs, and digital platforms.",
            "skills": ["Writing", "Video Editing", "Social Media", "Storytelling"],
            "growth_potential": "Medium",
            "avg_salary": "$45,000 - $85,000"
        },
        {
            "id": "career_8",
            "title": "AI/ML Engineer",
            "category": "Technology",
            "description": "Build and deploy artificial intelligence and machine learning models.",
            "skills": ["Python", "TensorFlow", "Deep Learning", "Mathematics"],
            "growth_potential": "Very High",
            "avg_salary": "$120,000 - $180,000"
        }
    ]
    
    return {"careers": careers}

@api_router.post("/careers/recommend")
async def recommend_careers(
    profile_data: dict,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    """Get AI-powered career recommendations based on user profile"""
    user = await get_current_user(request, session_token)
    
    # Save/update career profile
    profile_id = f"profile_{user.user_id}"
    profile_doc = {
        "profile_id": profile_id,
        "user_id": user.user_id,
        "interests": profile_data.get("interests", []),
        "skills": profile_data.get("skills", []),
        "experience_level": profile_data.get("experience_level", "beginner"),
        "preferred_industries": profile_data.get("preferred_industries", []),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.career_profiles.update_one(
        {"user_id": user.user_id},
        {"$set": profile_doc},
        upsert=True
    )
    
    # Use AI to generate recommendations
    try:
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"recommend_{user.user_id}",
            system_message="You are a career advisor. Provide 3-5 specific career recommendations based on the user's profile. Format as a JSON array."
        ).with_model("openai", "gpt-5.2")
        
        prompt = f"""Based on this profile, recommend suitable careers:
        Interests: {', '.join(profile_data.get('interests', []))}
        Skills: {', '.join(profile_data.get('skills', []))}
        Experience Level: {profile_data.get('experience_level', 'beginner')}
        Preferred Industries: {', '.join(profile_data.get('preferred_industries', []))}
        
        Provide 3-5 career recommendations with title, why it matches, and key skills needed."""
        
        user_msg = UserMessage(text=prompt)
        ai_response = await chat.send_message(user_msg)
        
        return {"recommendations": ai_response, "profile_id": profile_id}
        
    except Exception as e:
        logger.error(f"Career recommendation error: {e}")
        return {"recommendations": "Unable to generate recommendations at this time.", "profile_id": profile_id}

# ==================== ROADMAP ROUTES ====================

@api_router.post("/roadmap/generate")
async def generate_roadmap(
    roadmap_request: dict,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    """Generate personalized learning roadmap for a career"""
    user = await get_current_user(request, session_token)
    
    career_title = roadmap_request.get("career_title", "")
    experience_level = roadmap_request.get("experience_level", "beginner")
    
    # Use AI to generate detailed roadmap
    try:
        chat = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=f"roadmap_{user.user_id}_{uuid.uuid4().hex[:6]}",
            system_message="You are a career development expert. Create detailed, actionable learning roadmaps."
        ).with_model("openai", "gpt-5.2")
        
        prompt = f"""Create a detailed learning roadmap for becoming a {career_title}.
        User's current level: {experience_level}
        
        Include:
        1. Step-by-step learning path (6-8 steps)
        2. Key skills to develop at each step
        3. Recommended resources (courses, books, projects)
        4. Estimated time for each step
        
        Format as a structured response with clear sections."""
        
        user_msg = UserMessage(text=prompt)
        ai_response = await chat.send_message(user_msg)
        
        # Save roadmap
        roadmap_id = f"roadmap_{uuid.uuid4().hex[:12]}"
        roadmap_doc = {
            "roadmap_id": roadmap_id,
            "user_id": user.user_id,
            "career_title": career_title,
            "description": f"Learning path for {career_title}",
            "content": ai_response,
            "experience_level": experience_level,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.roadmaps.insert_one(roadmap_doc)
        
        return {"roadmap": ai_response, "roadmap_id": roadmap_id}
        
    except Exception as e:
        logger.error(f"Roadmap generation error: {e}")
        return {"roadmap": "Unable to generate roadmap at this time.", "roadmap_id": None}

@api_router.get("/roadmap/list")
async def list_roadmaps(
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    """Get user's saved roadmaps"""
    user = await get_current_user(request, session_token)
    
    roadmaps = await db.roadmaps.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(50)
    
    return {"roadmaps": roadmaps}

@api_router.get("/roadmap/{roadmap_id}")
async def get_roadmap(
    roadmap_id: str,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    """Get specific roadmap"""
    user = await get_current_user(request, session_token)
    
    roadmap = await db.roadmaps.find_one(
        {"roadmap_id": roadmap_id, "user_id": user.user_id},
        {"_id": 0}
    )
    
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    return roadmap

# ==================== USER PROFILE ROUTES ====================

@api_router.get("/user/profile")
async def get_user_profile(
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    """Get user profile with stats"""
    user = await get_current_user(request, session_token)
    
    # Get stats
    total_chats = await db.chat_messages.count_documents({"user_id": user.user_id, "role": "user"})
    total_roadmaps = await db.roadmaps.count_documents({"user_id": user.user_id})
    
    # Get career profile
    career_profile = await db.career_profiles.find_one(
        {"user_id": user.user_id},
        {"_id": 0}
    )
    
    return {
        "user": user.model_dump(),
        "stats": {
            "total_chats": total_chats,
            "total_roadmaps": total_roadmaps
        },
        "career_profile": career_profile
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
