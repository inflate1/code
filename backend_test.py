#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for FileClerkAI
Tests all major API endpoints and functionality
"""

import requests
import json
import os
import io
import time
from pathlib import Path
from typing import Dict, Any, Optional

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://717bc5e5-05c1-4dae-9ba1-258d09f62584.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

class FileClerkAITester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.session_id = None
        self.user_id = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"    {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def set_auth_header(self):
        """Set authorization header for authenticated requests"""
        if self.auth_token:
            self.session.headers.update({
                'Authorization': f'Bearer {self.auth_token}'
            })
    
    def test_health_check(self):
        """Test basic health check endpoints"""
        print("\n=== Testing Health Check Endpoints ===")
        
        try:
            # Test root endpoint
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                if "FileClerkAI Backend API is running" in data.get("message", ""):
                    self.log_test("Root endpoint", True, f"Message: {data['message']}")
                else:
                    self.log_test("Root endpoint", False, f"Unexpected message: {data}")
            else:
                self.log_test("Root endpoint", False, f"Status: {response.status_code}")
                
            # Test health endpoint
            response = self.session.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health endpoint", True, f"Status: {data['status']}, Service: {data.get('service')}")
                else:
                    self.log_test("Health endpoint", False, f"Unexpected status: {data}")
            else:
                self.log_test("Health endpoint", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Health check", False, f"Exception: {str(e)}")
    
    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n=== Testing Authentication Endpoints ===")
        
        try:
            # Test session creation
            response = self.session.post(f"{API_BASE}/auth/session")
            if response.status_code == 200:
                data = response.json()
                if "session_id" in data and "token" in data:
                    self.session_id = data["session_id"]
                    self.auth_token = data["token"]
                    self.user_id = data["user_id"]
                    self.set_auth_header()
                    self.log_test("Create session", True, f"Session ID: {self.session_id[:8]}...")
                else:
                    self.log_test("Create session", False, f"Missing required fields: {data}")
            else:
                self.log_test("Create session", False, f"Status: {response.status_code}")
                
            # Test login with demo credentials
            login_data = {
                "username": "demo_user",
                "password": "demo_password"
            }
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if "token" in data and data.get("user_id") == "demo_user":
                    # Update auth token with login token
                    self.auth_token = data["token"]
                    self.session_id = data["session_id"]
                    self.user_id = data["user_id"]
                    self.set_auth_header()
                    self.log_test("Login with demo credentials", True, f"User: {data['user_id']}")
                else:
                    self.log_test("Login with demo credentials", False, f"Invalid response: {data}")
            else:
                self.log_test("Login with demo credentials", False, f"Status: {response.status_code}")
                
            # Test get current session
            if self.auth_token:
                response = self.session.get(f"{API_BASE}/auth/session")
                if response.status_code == 200:
                    data = response.json()
                    if data.get("user_id") == self.user_id:
                        self.log_test("Get current session", True, f"User: {data['user_id']}")
                    else:
                        self.log_test("Get current session", False, f"User mismatch: {data}")
                else:
                    self.log_test("Get current session", False, f"Status: {response.status_code}")
                    
        except Exception as e:
            self.log_test("Authentication", False, f"Exception: {str(e)}")
    
    def create_test_pdf(self) -> bytes:
        """Create a simple test PDF content"""
        # Simple PDF content for testing
        pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Test Document Content) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF"""
        return pdf_content
    
    def test_document_management(self):
        """Test document upload and management endpoints"""
        print("\n=== Testing Document Management ===")
        
        if not self.auth_token:
            self.log_test("Document management", False, "No auth token available")
            return
            
        document_id = None
        
        try:
            # Test document upload
            pdf_content = self.create_test_pdf()
            files = {
                'file': ('test_contract.pdf', io.BytesIO(pdf_content), 'application/pdf')
            }
            data = {
                'category': 'contracts',
                'tags': '["legal", "test"]',
                'auto_categorize': 'true'
            }
            
            response = self.session.post(f"{API_BASE}/documents/upload", files=files, data=data)
            if response.status_code == 200:
                doc_data = response.json()
                if "id" in doc_data and doc_data.get("original_filename") == "test_contract.pdf":
                    document_id = doc_data["id"]
                    self.log_test("Upload document", True, f"Document ID: {document_id[:8]}...")
                else:
                    self.log_test("Upload document", False, f"Invalid response: {doc_data}")
            else:
                self.log_test("Upload document", False, f"Status: {response.status_code}, Response: {response.text}")
                
            # Test get documents list
            response = self.session.get(f"{API_BASE}/documents/")
            if response.status_code == 200:
                docs = response.json()
                if isinstance(docs, list):
                    self.log_test("Get documents list", True, f"Found {len(docs)} documents")
                else:
                    self.log_test("Get documents list", False, f"Expected list, got: {type(docs)}")
            else:
                self.log_test("Get documents list", False, f"Status: {response.status_code}")
                
            # Test get specific document
            if document_id:
                response = self.session.get(f"{API_BASE}/documents/{document_id}")
                if response.status_code == 200:
                    doc_data = response.json()
                    if doc_data.get("id") == document_id:
                        self.log_test("Get specific document", True, f"Retrieved document: {doc_data['original_filename']}")
                    else:
                        self.log_test("Get specific document", False, f"ID mismatch: {doc_data}")
                else:
                    self.log_test("Get specific document", False, f"Status: {response.status_code}")
                    
            # Test document search
            search_data = {
                "query": "contract",
                "categories": ["contracts"],
                "limit": 10
            }
            response = self.session.post(f"{API_BASE}/documents/search", json=search_data)
            if response.status_code == 200:
                results = response.json()
                if isinstance(results, list):
                    self.log_test("Document search", True, f"Found {len(results)} search results")
                else:
                    self.log_test("Document search", False, f"Expected list, got: {type(results)}")
            else:
                self.log_test("Document search", False, f"Status: {response.status_code}")
                
            # Test document action (summarize)
            if document_id:
                action_data = {
                    "action": "summarize",
                    "document_ids": [document_id],
                    "parameters": {"length": "short"}
                }
                response = self.session.post(f"{API_BASE}/documents/action", json=action_data)
                if response.status_code == 200:
                    result = response.json()
                    if "task_id" in result:
                        self.log_test("Document action (summarize)", True, f"Task ID: {result['task_id'][:8]}...")
                    else:
                        self.log_test("Document action (summarize)", False, f"No task_id in response: {result}")
                else:
                    self.log_test("Document action (summarize)", False, f"Status: {response.status_code}")
                    
        except Exception as e:
            self.log_test("Document management", False, f"Exception: {str(e)}")
    
    def test_voice_commands(self):
        """Test voice command processing"""
        print("\n=== Testing Voice Commands ===")
        
        if not self.auth_token:
            self.log_test("Voice commands", False, "No auth token available")
            return
            
        try:
            # Test voice command processing
            command_data = {
                "command": "Find all contracts from last month",
                "context": {"user_preference": "detailed"}
            }
            response = self.session.post(f"{API_BASE}/voice/command", json=command_data)
            if response.status_code == 200:
                result = response.json()
                if "intent" in result and "response" in result:
                    self.log_test("Process voice command", True, f"Intent: {result['intent']}")
                else:
                    self.log_test("Process voice command", False, f"Missing required fields: {result}")
            else:
                self.log_test("Process voice command", False, f"Status: {response.status_code}")
                
            # Test audio transcription (mock)
            # Create a dummy audio file
            audio_content = b"dummy audio content for testing"
            files = {
                'audio': ('test_audio.wav', io.BytesIO(audio_content), 'audio/wav')
            }
            response = self.session.post(f"{API_BASE}/voice/transcribe", files=files)
            if response.status_code == 200:
                result = response.json()
                if "transcription" in result and "confidence" in result:
                    self.log_test("Audio transcription", True, f"Transcription: {result['transcription'][:50]}...")
                else:
                    self.log_test("Audio transcription", False, f"Missing required fields: {result}")
            else:
                self.log_test("Audio transcription", False, f"Status: {response.status_code}")
                
            # Test text-to-speech
            tts_data = {
                "text": "Hello, this is a test of the text to speech functionality",
                "voice": "default"
            }
            response = self.session.post(f"{API_BASE}/voice/text-to-speech", json=tts_data)
            if response.status_code == 200:
                result = response.json()
                if "audio_url" in result:
                    self.log_test("Text-to-speech", True, f"Audio URL: {result['audio_url']}")
                else:
                    self.log_test("Text-to-speech", False, f"No audio_url in response: {result}")
            else:
                self.log_test("Text-to-speech", False, f"Status: {response.status_code}")
                
            # Test supported languages
            response = self.session.get(f"{API_BASE}/voice/supported-languages")
            if response.status_code == 200:
                result = response.json()
                if "transcription" in result and "synthesis" in result:
                    self.log_test("Get supported languages", True, f"Transcription languages: {len(result['transcription'])}")
                else:
                    self.log_test("Get supported languages", False, f"Missing language data: {result}")
            else:
                self.log_test("Get supported languages", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Voice commands", False, f"Exception: {str(e)}")
    
    def test_task_management(self):
        """Test task management endpoints"""
        print("\n=== Testing Task Management ===")
        
        if not self.auth_token:
            self.log_test("Task management", False, "No auth token available")
            return
            
        try:
            # Test get tasks list
            response = self.session.get(f"{API_BASE}/tasks/")
            if response.status_code == 200:
                tasks = response.json()
                if isinstance(tasks, list):
                    self.log_test("Get tasks list", True, f"Found {len(tasks)} tasks")
                    
                    # Test get specific task if any exist
                    if tasks:
                        task_id = tasks[0]["id"]
                        response = self.session.get(f"{API_BASE}/tasks/{task_id}")
                        if response.status_code == 200:
                            task_data = response.json()
                            if task_data.get("id") == task_id:
                                self.log_test("Get specific task", True, f"Task status: {task_data['status']}")
                            else:
                                self.log_test("Get specific task", False, f"ID mismatch: {task_data}")
                        else:
                            self.log_test("Get specific task", False, f"Status: {response.status_code}")
                else:
                    self.log_test("Get tasks list", False, f"Expected list, got: {type(tasks)}")
            else:
                self.log_test("Get tasks list", False, f"Status: {response.status_code}")
                
            # Test task statistics
            response = self.session.get(f"{API_BASE}/tasks/stats/summary")
            if response.status_code == 200:
                stats = response.json()
                if "total_tasks" in stats and "completion_rate" in stats:
                    self.log_test("Get task statistics", True, f"Total tasks: {stats['total_tasks']}, Completion rate: {stats['completion_rate']}%")
                else:
                    self.log_test("Get task statistics", False, f"Missing stats fields: {stats}")
            else:
                self.log_test("Get task statistics", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Task management", False, f"Exception: {str(e)}")
    
    def test_activity_tracking(self):
        """Test activity tracking endpoints"""
        print("\n=== Testing Activity Tracking ===")
        
        if not self.auth_token:
            self.log_test("Activity tracking", False, "No auth token available")
            return
            
        try:
            # Test get activities
            response = self.session.get(f"{API_BASE}/activities/")
            if response.status_code == 200:
                activities = response.json()
                if isinstance(activities, list):
                    self.log_test("Get activities list", True, f"Found {len(activities)} activities")
                else:
                    self.log_test("Get activities list", False, f"Expected list, got: {type(activities)}")
            else:
                self.log_test("Get activities list", False, f"Status: {response.status_code}")
                
            # Test activity summary
            response = self.session.get(f"{API_BASE}/activities/summary?days=7")
            if response.status_code == 200:
                summary = response.json()
                if isinstance(summary, dict):
                    self.log_test("Get activity summary", True, f"Summary data: {len(summary)} fields")
                else:
                    self.log_test("Get activity summary", False, f"Expected dict, got: {type(summary)}")
            else:
                self.log_test("Get activity summary", False, f"Status: {response.status_code}")
                
            # Test get memories
            response = self.session.get(f"{API_BASE}/activities/memories")
            if response.status_code == 200:
                memories = response.json()
                if isinstance(memories, list):
                    self.log_test("Get memories", True, f"Found {len(memories)} memories")
                else:
                    self.log_test("Get memories", False, f"Expected list, got: {type(memories)}")
            else:
                self.log_test("Get memories", False, f"Status: {response.status_code}")
                
            # Test create memory
            memory_data = {
                "title": "Test Memory",
                "content": "This is a test memory created during backend testing",
                "memory_type": "general",
                "tags": ["test", "backend"],
                "starred": False
            }
            response = self.session.post(f"{API_BASE}/activities/memories", json=memory_data)
            if response.status_code == 200:
                memory = response.json()
                if "id" in memory and memory.get("title") == "Test Memory":
                    memory_id = memory["id"]
                    self.log_test("Create memory", True, f"Memory ID: {memory_id[:8]}...")
                    
                    # Test get specific memory
                    response = self.session.get(f"{API_BASE}/activities/memories/{memory_id}")
                    if response.status_code == 200:
                        retrieved_memory = response.json()
                        if retrieved_memory.get("id") == memory_id:
                            self.log_test("Get specific memory", True, f"Retrieved: {retrieved_memory['title']}")
                        else:
                            self.log_test("Get specific memory", False, f"ID mismatch: {retrieved_memory}")
                    else:
                        self.log_test("Get specific memory", False, f"Status: {response.status_code}")
                else:
                    self.log_test("Create memory", False, f"Invalid response: {memory}")
            else:
                self.log_test("Create memory", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Activity tracking", False, f"Exception: {str(e)}")
    
    def test_complete_workflow(self):
        """Test complete workflow: Login -> Upload -> Voice Command -> Check Task -> View Activities"""
        print("\n=== Testing Complete Workflow ===")
        
        try:
            workflow_success = True
            
            # Step 1: Already logged in from previous tests
            if not self.auth_token:
                self.log_test("Complete workflow", False, "No authentication available")
                return
                
            # Step 2: Upload a document
            pdf_content = self.create_test_pdf()
            files = {
                'file': ('workflow_test.pdf', io.BytesIO(pdf_content), 'application/pdf')
            }
            data = {
                'category': 'workflow',
                'tags': '["workflow", "test"]',
                'auto_categorize': 'true'
            }
            
            response = self.session.post(f"{API_BASE}/documents/upload", files=files, data=data)
            if response.status_code != 200:
                workflow_success = False
                self.log_test("Workflow - Document upload", False, f"Status: {response.status_code}")
            else:
                doc_data = response.json()
                document_id = doc_data["id"]
                
            # Step 3: Process voice command
            command_data = {
                "command": "Summarize all workflow documents",
                "context": {"category": "workflow"}
            }
            response = self.session.post(f"{API_BASE}/voice/command", json=command_data)
            if response.status_code != 200:
                workflow_success = False
                self.log_test("Workflow - Voice command", False, f"Status: {response.status_code}")
                
            # Step 4: Check tasks
            response = self.session.get(f"{API_BASE}/tasks/")
            if response.status_code != 200:
                workflow_success = False
                self.log_test("Workflow - Check tasks", False, f"Status: {response.status_code}")
                
            # Step 5: View activities
            response = self.session.get(f"{API_BASE}/activities/")
            if response.status_code != 200:
                workflow_success = False
                self.log_test("Workflow - View activities", False, f"Status: {response.status_code}")
                
            if workflow_success:
                self.log_test("Complete workflow", True, "All workflow steps completed successfully")
            else:
                self.log_test("Complete workflow", False, "Some workflow steps failed")
                
        except Exception as e:
            self.log_test("Complete workflow", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting FileClerkAI Backend Test Suite")
        print(f"📡 Testing against: {API_BASE}")
        
        start_time = time.time()
        
        # Run test suites in order
        self.test_health_check()
        self.test_authentication()
        self.test_document_management()
        self.test_voice_commands()
        self.test_task_management()
        self.test_activity_tracking()
        self.test_complete_workflow()
        
        # Print summary
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"\n{'='*60}")
        print("📊 TEST SUMMARY")
        print(f"{'='*60}")
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"⏱️  Duration: {duration:.2f} seconds")
        print(f"📈 Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['details']}")
        
        print(f"\n{'='*60}")
        
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": passed_tests/total_tests*100,
            "duration": duration,
            "results": self.test_results
        }

def main():
    """Main test execution"""
    tester = FileClerkAITester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    if results["failed"] == 0:
        print("🎉 All tests passed!")
        exit(0)
    else:
        print(f"💥 {results['failed']} tests failed!")
        exit(1)

if __name__ == "__main__":
    main()