#!/usr/bin/env python3
"""
Simple API Tests for AI Career Mentor
"""
import requests
import json
import sys
from datetime import datetime

BACKEND_URL = "https://mentor-chat-hub.preview.emergentagent.com"
SESSION_TOKEN = "test_session_1771227595229"  # From MongoDB setup

def test_api(name, method, endpoint, expected_status=200, data=None):
    """Test a single API endpoint"""
    url = f"{BACKEND_URL}/api/{endpoint.lstrip('/')}"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {SESSION_TOKEN}'
    }
    
    print(f"\n🔍 Testing {name}...")
    print(f"URL: {url}")
    
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers, timeout=15)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers, timeout=15)
        else:
            print(f"❌ Unsupported method: {method}")
            return False, {}
            
        print(f"Status: {response.status_code}")
        
        if response.status_code == expected_status:
            print(f"✅ {name} - Success")
            try:
                return True, response.json()
            except:
                return True, {"message": response.text}
        else:
            print(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
            print(f"Response: {response.text[:300]}")
            return False, {}
            
    except requests.exceptions.Timeout:
        print(f"❌ {name} - Timeout")
        return False, {}
    except Exception as e:
        print(f"❌ {name} - Error: {e}")
        return False, {}

def main():
    print("🚀 AI Career Mentor API Quick Test")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Session Token: {SESSION_TOKEN[:20]}...")
    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: Authentication
    total_tests += 1
    success, user_data = test_api("Get Current User", "GET", "auth/me")
    if success:
        tests_passed += 1
        print(f"👤 User: {user_data.get('name', 'Unknown')}")
    
    # Test 2: Chat Send
    total_tests += 1
    success, chat_data = test_api(
        "Send Chat Message", "POST", "chat/send",
        data={"message": "What careers are good for technology enthusiasts?"}
    )
    if success:
        tests_passed += 1
        conversation_id = chat_data.get('conversation_id')
        print(f"💬 Chat Response: {chat_data.get('response', '')[:100]}...")
        
        # Test 3: Chat History  
        if conversation_id:
            total_tests += 1
            success, history = test_api("Get Chat History", "GET", f"chat/history?conversation_id={conversation_id}")
            if success:
                tests_passed += 1
                print(f"📚 Chat History: {len(history.get('messages', []))} messages")
    
    # Test 4: Career Exploration
    total_tests += 1
    success, careers = test_api("Explore Careers", "GET", "careers/explore")
    if success:
        tests_passed += 1
        career_count = len(careers.get('careers', []))
        print(f"🔍 Careers Available: {career_count}")
    
    # Test 5: Roadmap Generation
    total_tests += 1
    success, roadmap = test_api(
        "Generate Roadmap", "POST", "roadmap/generate",
        data={"career_title": "Software Engineer", "experience_level": "beginner"}
    )
    if success:
        tests_passed += 1
        roadmap_id = roadmap.get('roadmap_id')
        print(f"🗺️ Roadmap Generated: {roadmap_id}")
        
        # Test 6: List Roadmaps
        total_tests += 1
        success, roadmap_list = test_api("List Roadmaps", "GET", "roadmap/list")
        if success:
            tests_passed += 1
            print(f"📋 Total Roadmaps: {len(roadmap_list.get('roadmaps', []))}")
    
    # Test 7: User Profile
    total_tests += 1
    success, profile = test_api("Get User Profile", "GET", "user/profile")
    if success:
        tests_passed += 1
        stats = profile.get('stats', {})
        print(f"👤 Profile Stats - Chats: {stats.get('total_chats', 0)}, Roadmaps: {stats.get('total_roadmaps', 0)}")
    
    # Results
    print(f"\n{'='*50}")
    print(f"📊 RESULTS: {tests_passed}/{total_tests} tests passed")
    success_rate = (tests_passed/total_tests)*100 if total_tests > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("✅ Backend APIs are working well!")
        return 0
    else:
        print("❌ Multiple API failures detected")
        return 1

if __name__ == "__main__":
    sys.exit(main())