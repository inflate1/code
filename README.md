# FileClerkAI - AI-Powered Document Assistant

## 🎯 Overview

FileClerkAI is a comprehensive, AI-powered document management system that enables users to interact with their documents through natural language voice commands. The system features intelligent document processing, automated workflows, and persistent memory capabilities.

## 🚀 Quick Start

### Demo Mode (No Backend Required)
```bash
# Access the interactive demo
http://localhost:3000?demo=true
```

### Full Application
```bash
# Start all services
sudo supervisorctl start all

# Access the application
http://localhost:3000

# Mock mode (frontend only)
http://localhost:3000?mock=true
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Voice Command Console** - Natural language input with Web Speech API
- **Document Library** - File upload, categorization, and management
- **Smart Activity Feed** - Real-time action tracking
- **Memory Recall System** - Persistent storage for workflows and insights
- **Agent Toolkit** - AI-powered document actions
- **Analytics Dashboard** - Usage metrics and performance insights

### Backend (FastAPI + MongoDB)
- **Document Processing** - Text extraction from PDF, Word, Excel
- **AI Integration** - LLM-powered command processing and analysis
- **Embedding Pipeline** - Vector similarity search for documents
- **Task Queue** - Asynchronous background processing
- **Authentication** - JWT-based session management
- **Activity Logging** - Comprehensive audit trail

## 🎭 Operating Modes

### 1. Demo Mode (`?demo=true`)
- **Purpose**: Interactive demonstration without backend
- **Features**: 
  - File upload simulation
  - Voice command processing
  - Live activity feed updates
  - Workflow demonstrations
- **Usage**: Perfect for showcasing capabilities to stakeholders

### 2. Mock Mode (`?mock=true`)
- **Purpose**: Full frontend experience with simulated data
- **Features**:
  - Complete UI functionality
  - LocalStorage persistence
  - Realistic data interactions
  - Toggle between mock/live modes
- **Usage**: UI testing, design feedback, offline development

### 3. Live Mode (Default)
- **Purpose**: Full-stack application with real backend
- **Features**:
  - Real document processing
  - Actual AI integration
  - Database persistence
  - Production-ready workflows
- **Usage**: Production deployment

## 📋 Features

### Voice Command Processing
```javascript
// Example voice commands
"Find the signed contract from last October for ACME Corp"
"Merge the three most recent invoices from Vendor A into one PDF"
"Summarize all HR onboarding forms signed this month"
"Show me all compliance documents that need review"
```

### Document Operations
- **Upload**: Drag & drop or click to upload PDF, Word, Excel files
- **Auto-categorization**: AI automatically categorizes documents
- **Text extraction**: Full-text search and indexing
- **Smart tagging**: Automatic tag generation based on content
- **Batch operations**: Process multiple documents simultaneously

### Agent Toolkit Actions
- **Summarize**: AI-powered document summarization
- **Compare**: Find differences between documents
- **Merge**: Combine multiple documents into one
- **Translate**: Convert documents to different languages
- **Redact**: Remove sensitive information
- **Extract**: Pull specific data from documents

### Memory System
- **Summaries**: Save document insights for future reference
- **Routines**: Create reusable workflows
- **Bookmarks**: Mark important findings
- **History**: Track previous interactions and queries

## 🔧 Development

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB
- React development environment

### Frontend Development
```bash
cd frontend
yarn install
yarn start
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload
```

### Environment Variables
```bash
# Frontend (.env)
REACT_APP_BACKEND_URL=http://localhost:8001

# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=fileclerk_ai
JWT_SECRET_KEY=your-secret-key
```

## 🧪 Testing

### Testing Modes Available

#### 1. Demo Mode Testing (`?demo=true`)
- **Interactive Demo**: Full workflow demonstration
- **File Upload**: Simulate document upload and processing
- **Voice Commands**: Test natural language processing
- **Activity Tracking**: Real-time activity updates
- **Perfect for**: Stakeholder demos, UI testing, feature showcasing

#### 2. Mock Mode Testing (`?mock=true`)
- **Full Frontend**: Complete application UI with simulated data
- **Persistent Storage**: Uses localStorage for data persistence
- **Realistic Interactions**: All features work with mock backend
- **Toggle Support**: Switch between mock and live modes
- **Perfect for**: Development, testing, offline demos

#### 3. Live Mode Testing (Default)
- **Full Stack**: Real backend integration
- **Database**: MongoDB with persistent storage
- **AI Integration**: Ready for OpenAI/Claude integration
- **Production Ready**: Complete authentication and security
- **Perfect for**: Production deployment, real-world usage

### Manual Testing Workflows

#### 1. Document Upload Flow
1. Click "Upload File" button
2. Select PDF, Word, or Excel document
3. Verify auto-categorization
4. Check activity feed for upload confirmation
5. Confirm document appears in library

#### 2. Voice Command Flow
1. Click microphone icon or type command
2. Say: "Find all contracts"
3. Verify AI processing response
4. Check that relevant documents are highlighted
5. Confirm activity is logged

#### 3. Agent Action Flow
1. Select a document from library
2. Choose action from Agent Toolkit
3. Confirm action in approval dialog
4. Monitor task progress
5. Verify completion in activity feed

## 🔒 Security

### Authentication
- JWT-based session management
- Token expiration handling
- Secure session storage

### Data Protection
- Input validation and sanitization
- File type restrictions
- Access control per user
- Audit logging for all actions

### Privacy
- Local file storage (not cloud by default)
- No data sharing with external services
- User-controlled data retention

## 📊 Analytics

### Usage Metrics
- Document processing statistics
- Voice command frequency
- Time saved calculations
- User activity patterns

### Performance Monitoring
- API response times
- File processing durations
- System resource usage
- Error rate tracking

## 🚀 Deployment

### Local Development
```bash
# Start all services
sudo supervisorctl start all

# Check status
sudo supervisorctl status
```

### Production Deployment
1. Configure environment variables
2. Set up MongoDB database
3. Configure file storage
4. Set up reverse proxy (nginx)
5. Enable SSL/TLS
6. Configure monitoring

## 🔌 API Integration

### Adding Real AI Services

#### OpenAI Integration
```python
# Replace mock responses in llm_service.py
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

async def process_voice_command(command: str):
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": command}]
    )
    return response.choices[0].message.content
```

#### Document Processing
```python
# Add real document processing
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

async def summarize_document(text: str):
    return summarizer(text, max_length=130, min_length=30, do_sample=False)
```

## 📚 Documentation

### API Documentation
- FastAPI auto-generated docs: `http://localhost:8001/docs`
- OpenAPI specification: `http://localhost:8001/openapi.json`

### Component Documentation
- React components with JSDoc
- TypeScript interfaces
- Storybook component library

## 🐛 Troubleshooting

### Common Issues

#### Backend Not Starting
```bash
# Check logs
sudo supervisorctl tail backend

# Restart services
sudo supervisorctl restart backend
```

#### Frontend Build Errors
```bash
# Clear cache
cd frontend && yarn cache clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
yarn install
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongodb

# Restart MongoDB
sudo systemctl restart mongodb
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review process

### Code Standards
- ESLint for JavaScript/TypeScript
- Black for Python formatting
- Conventional commits
- Test coverage requirements

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

### Planned Features
- Multi-language support
- Advanced OCR capabilities
- Integration with cloud storage
- Mobile application
- Collaborative features
- Advanced analytics dashboard

### AI Improvements
- Better intent recognition
- Context-aware responses
- Learning from user behavior
- Advanced document understanding
- Predictive workflows

---

**Made with ❤️ by the FileClerkAI Team using Emergent.sh**

For support and documentation, visit the application or contact your development team.
