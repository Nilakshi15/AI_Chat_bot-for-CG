#!/usr/bin/env python3
"""
AI Career Mentor Backend API Tests
Tests all API endpoints with proper authentication
"""
import requests
import json
import sys
import time
from datetime import datetime, timezone, timedelta

class CareerMentorAPITester:
    def __init__(self, base_url="https://mentor-chat-hub.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.conversation_id = None
        self.roadmap_id = None

    def log(self, message, status="INFO"):
        """Log test results with timestamps"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        status_emoji = {"INFO": "ℹ️", "PASS": "✅", "FAIL": "❌", "WARN": "⚠️"}
        print(f"[{timestamp}] {status_emoji.get(status, '')} {message}")

    def create_test_user_and_session(self):
        """Create test user and session in MongoDB using the auth playbook approach"""
        self.log("Creating test user and session in MongoDB...")
        
        # Generate unique identifiers
        timestamp = int(time.time())
        self.user_id = f"test-user-{timestamp}"
        self.session_token = f"test_session_{timestamp}"
        
        # MongoDB commands to create test data
        user_doc = {
            "user_id": self.user_id,
            "email": f"test.user.{timestamp}@example.com",
            "name": "Test User",
            "picture": "https://via.placeholder.com/150",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        session_doc = {
            "user_id": self.user_id,
            "session_token": self.session_token,
            "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        # Use mongosh to insert test data
        import subprocess
        
        # Insert user
        user_cmd = f"""
        mongosh --quiet --eval "
        use('test_database');
        db.users.insertOne({json.dumps(user_doc)});
        print('User created: {self.user_id}');
        "
        """
        
        # Insert session  
        session_cmd = f"""
        mongosh --quiet --eval "
        use('test_database');
        db.user_sessions.insertOne({json.dumps(session_doc)});
        print('Session created: {self.session_token}');
        "
        """
        
        try:
            subprocess.run(user_cmd, shell=True, check=True, capture_output=True, text=True)
            subprocess.run(session_cmd, shell=True, check=True, capture_output=True, text=True)
            self.log(f"Test user created: {self.user_id}", "PASS")
            self.log(f"Session token: {self.session_token}", "INFO")
            return True
        except subprocess.CalledProcessError as e:
            self.log(f"Failed to create test data: {e}", "FAIL")
            return False

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint.lstrip('/')}"
        
        # Prepare headers
        test_headers = {'Content-Type': 'application/json'}
        if self.session_token:
            test_headers['Authorization'] = f'Bearer {self.session_token}'
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"Testing {name}...")
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            # Check status code
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                self.log(f"✓ {name} - Status: {response.status_code}", "PASS")
                
                # Try to parse JSON response
                try:
                    response_data = response.json()
                    return True, response_data
                except json.JSONDecodeError:
                    return True, {"message": response.text}
            else:
                self.log(f"✗ {name} - Expected {expected_status}, got {response.status_code}", "FAIL")
                self.log(f"Response: {response.text[:200]}", "FAIL")
                return False, {}

        except requests.exceptions.Timeout:
            self.log(f"✗ {name} - Request timed out", "FAIL")
            return False, {}
        except Exception as e:
            self.log(f"✗ {name} - Error: {str(e)}", "FAIL")
            return False, {}

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        self.log("=== TESTING AUTH ENDPOINTS ===")
        
        # Test /auth/me
        success, response = self.run_test(
            "Get Current User", "GET", "auth/me", 200
        )
        
        if success and "user_id" in response:
            self.log(f"User authenticated: {response.get('name')}", "PASS")
            return True
        else:
            self.log("Authentication failed", "FAIL")
            return False

    def test_chat_endpoints(self):
        """Test chat functionality"""
        self.log("=== TESTING CHAT ENDPOINTS ===")
        
        # Test sending a chat message
        success, response = self.run_test(
            "Send Chat Message", "POST", "chat/send", 200,
            data={
                "message": "Hi! What careers are best for someone interested in technology?",
                "conversation_id": None
            }
        )
        
        if success and "conversation_id" in response:
            self.conversation_id = response["conversation_id"]
            self.log(f"Chat response received, conversation: {self.conversation_id}", "PASS")
            
            # Wait a bit for AI processing
            time.sleep(2)
            
            # Test getting chat history
            success, history = self.run_test(
                "Get Chat History", "GET", f"chat/history?conversation_id={self.conversation_id}", 200
            )
            
            if success and "messages" in history:
                self.log(f"Chat history retrieved: {len(history['messages'])} messages", "PASS")
                return True
                
        return False

    def test_career_endpoints(self):
        """Test career exploration endpoints"""
        self.log("=== TESTING CAREER ENDPOINTS ===")
        
        # Test career exploration
        success, response = self.run_test(
            "Explore Careers", "GET", "careers/explore", 200
        )
        
        if success and "careers" in response:
            careers_count = len(response["careers"])
            self.log(f"Careers loaded: {careers_count}", "PASS")
            
            if careers_count > 0:
                # Test career recommendations
                test_profile = {
                    "interests": ["technology", "problem solving"],
                    "skills": ["programming", "analysis"],
                    "experience_level": "beginner",
                    "preferred_industries": ["technology"]
                }
                
                success, rec_response = self.run_test(
                    "Get Career Recommendations", "POST", "careers/recommend", 200,
                    data=test_profile
                )
                
                if success and "recommendations" in rec_response:
                    self.log("Career recommendations generated", "PASS")
                    return True
                    
        return False

    def test_roadmap_endpoints(self):
        """Test roadmap functionality"""
        self.log("=== TESTING ROADMAP ENDPOINTS ===")
        
        # Test roadmap generation
        success, response = self.run_test(
            "Generate Roadmap", "POST", "roadmap/generate", 200,
            data={
                "career_title": "Software Engineer",
                "experience_level": "beginner"
            }
        )
        
        if success and "roadmap_id" in response and response["roadmap_id"]:
            self.roadmap_id = response["roadmap_id"]
            self.log(f"Roadmap generated: {self.roadmap_id}", "PASS")
            
            # Wait for AI processing
            time.sleep(2)
            
            # Test getting roadmap list
            success, list_response = self.run_test(
                "List Roadmaps", "GET", "roadmap/list", 200
            )
            
            if success and "roadmaps" in list_response:
                self.log(f"Roadmaps listed: {len(list_response['roadmaps'])}", "PASS")
                
                # Test getting specific roadmap
                if self.roadmap_id:
                    success, roadmap = self.run_test(
                        "Get Specific Roadmap", "GET", f"roadmap/{self.roadmap_id}", 200
                    )
                    
                    if success and "career_title" in roadmap:
                        self.log("Specific roadmap retrieved", "PASS")
                        return True
                        
        return False

    def test_profile_endpoints(self):
        """Test user profile endpoints"""
        self.log("=== TESTING PROFILE ENDPOINTS ===")
        
        success, response = self.run_test(
            "Get User Profile", "GET", "user/profile", 200
        )
        
        if success and "user" in response and "stats" in response:
            user_stats = response["stats"]
            self.log(f"Profile loaded - Chats: {user_stats.get('total_chats', 0)}, Roadmaps: {user_stats.get('total_roadmaps', 0)}", "PASS")
            return True
            
        return False

    def cleanup_test_data(self):
        """Clean up test data from MongoDB"""
        self.log("Cleaning up test data...")
        
        import subprocess
        
        cleanup_cmd = f"""
        mongosh --quiet --eval "
        use('test_database');
        db.users.deleteOne({{user_id: '{self.user_id}'}});
        db.user_sessions.deleteOne({{user_id: '{self.user_id}'}});
        db.chat_messages.deleteMany({{user_id: '{self.user_id}'}});
        db.roadmaps.deleteMany({{user_id: '{self.user_id}'}});
        db.career_profiles.deleteMany({{user_id: '{self.user_id}'}});
        print('Test data cleaned');
        "
        """
        
        try:
            subprocess.run(cleanup_cmd, shell=True, check=True, capture_output=True, text=True)
            self.log("Test data cleaned successfully", "PASS")
        except subprocess.CalledProcessError as e:
            self.log(f"Failed to clean test data: {e}", "WARN")

    def run_all_tests(self):
        """Run complete test suite"""
        self.log("🚀 Starting AI Career Mentor API Tests")
        self.log(f"Base URL: {self.base_url}")
        
        # Step 1: Setup test data
        if not self.create_test_user_and_session():
            self.log("Failed to create test data, aborting tests", "FAIL")
            return False
            
        try:
            # Step 2: Test authentication
            auth_success = self.test_auth_endpoints()
            
            # Step 3: Test chat functionality 
            chat_success = self.test_chat_endpoints()
            
            # Step 4: Test career exploration
            career_success = self.test_career_endpoints()
            
            # Step 5: Test roadmap generation
            roadmap_success = self.test_roadmap_endpoints()
            
            # Step 6: Test user profile
            profile_success = self.test_profile_endpoints()
            
        finally:
            # Step 7: Cleanup
            self.cleanup_test_data()
        
        # Results
        self.log("=" * 50)
        self.log(f"📊 TEST RESULTS: {self.tests_passed}/{self.tests_run} tests passed")
        self.log(f"✅ Authentication: {'PASS' if auth_success else 'FAIL'}")
        self.log(f"💬 Chat System: {'PASS' if chat_success else 'FAIL'}")  
        self.log(f"🔍 Career Explorer: {'PASS' if career_success else 'FAIL'}")
        self.log(f"🗺️ Roadmap Generator: {'PASS' if roadmap_success else 'FAIL'}")
        self.log(f"👤 User Profile: {'PASS' if profile_success else 'FAIL'}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        self.log(f"📈 Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 80

def main():
    """Main test runner"""
    tester = CareerMentorAPITester()
    success = tester.run_all_tests()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())