import { 
  mockDocuments, 
  mockActivities, 
  mockMemories, 
  mockTasks, 
  mockUpcomingTasks, 
  mockAgentActions, 
  mockAnalytics,
  mockActionResponses
} from './mockData';

// Local storage keys
const STORAGE_KEYS = {
  DOCUMENTS: 'fileclerk_mock_documents',
  ACTIVITIES: 'fileclerk_mock_activities',
  MEMORIES: 'fileclerk_mock_memories',
  TASKS: 'fileclerk_mock_tasks',
  USER: 'fileclerk_mock_user'
};

// Utility functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = () => Date.now() + Math.random().toString(36).substr(2, 9);

// Storage utilities
const getFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Initialize mock data in localStorage
const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    saveToStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    saveToStorage(STORAGE_KEYS.ACTIVITIES, mockActivities);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEMORIES)) {
    saveToStorage(STORAGE_KEYS.MEMORIES, mockMemories);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    saveToStorage(STORAGE_KEYS.TASKS, mockTasks);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    saveToStorage(STORAGE_KEYS.USER, {
      id: 'demo_user',
      username: 'demo_user',
      created_at: new Date().toISOString(),
      settings: {
        theme: 'light',
        notifications: true,
        auto_categorize: true
      }
    });
  }
};

// Mock API services
export const mockAuthService = {
  login: async (credentials) => {
    await delay(1000);
    
    if (credentials.username === 'demo_user' && credentials.password === 'demo_password') {
      const user = getFromStorage(STORAGE_KEYS.USER, {});
      const token = 'mock_jwt_token_' + generateId();
      
      localStorage.setItem('fileclerk_token', token);
      
      return {
        token,
        user,
        session_id: generateId(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    }
    
    throw new Error('Invalid credentials');
  },

  createSession: async () => {
    await delay(500);
    
    const user = getFromStorage(STORAGE_KEYS.USER, {});
    const token = 'mock_jwt_token_' + generateId();
    
    localStorage.setItem('fileclerk_token', token);
    
    return {
      token,
      user,
      session_id: generateId(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },

  getCurrentSession: async () => {
    await delay(300);
    
    const token = localStorage.getItem('fileclerk_token');
    if (!token) {
      throw new Error('No active session');
    }
    
    const user = getFromStorage(STORAGE_KEYS.USER, {});
    
    return {
      user,
      session_id: generateId(),
      last_activity: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem('fileclerk_token');
  }
};

export const mockDocumentService = {
  list: async (category = null, tags = null, limit = 50) => {
    await delay(800);
    
    let documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
    
    if (category) {
      documents = documents.filter(doc => doc.category === category);
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      documents = documents.filter(doc => 
        tagArray.some(tag => doc.tags.includes(tag.trim()))
      );
    }
    
    return documents.slice(0, limit);
  },

  upload: async (file, category = 'general', tags = [], autoCategories = true) => {
    await delay(2000);
    
    // Simulate file processing
    const mockDocument = {
      id: generateId(),
      filename: file.name.toLowerCase().replace(/[^a-z0-9.]/g, '_'),
      original_filename: file.name,
      file_path: `/mock/storage/${file.name}`,
      file_size: file.size,
      file_type: file.name.split('.').pop().toLowerCase(),
      mime_type: file.type,
      category: autoCategories ? 'general' : category,
      status: 'uploaded',
      tags: tags.length > 0 ? tags : ['uploaded', 'new'],
      user_id: 'demo_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      extracted_text: `Mock extracted text from ${file.name}`,
      content_summary: `Auto-generated summary for ${file.name}`,
      embedding: null
    };
    
    // Save to storage
    const documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, []);
    documents.unshift(mockDocument);
    saveToStorage(STORAGE_KEYS.DOCUMENTS, documents);
    
    // Add activity
    const activities = getFromStorage(STORAGE_KEYS.ACTIVITIES, []);
    activities.unshift({
      id: generateId(),
      user_id: 'demo_user',
      action: 'Document Uploaded',
      description: `Uploaded document: ${file.name}`,
      activity_type: 'upload',
      actor: 'user',
      file_type: file.name.split('.').pop().toUpperCase(),
      files: [file.name],
      created_at: new Date().toISOString(),
      metadata: { file_size: file.size }
    });
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
    
    return mockDocument;
  },

  search: async (query, categories = null, tags = null, limit = 10) => {
    await delay(1200);
    
    let documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
    
    if (query) {
      documents = documents.filter(doc =>
        doc.original_filename.toLowerCase().includes(query.toLowerCase()) ||
        doc.content_summary?.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    if (categories) {
      documents = documents.filter(doc => categories.includes(doc.category));
    }
    
    if (tags) {
      documents = documents.filter(doc =>
        tags.some(tag => doc.tags.includes(tag))
      );
    }
    
    return documents.slice(0, limit).map(doc => ({
      document: doc,
      relevance_score: Math.random() * 0.3 + 0.7, // Mock relevance score
      matching_content: doc.content_summary
    }));
  },

  performAction: async (action, documentIds, parameters = {}) => {
    await delay(1500);
    
    const documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, []);
    const selectedDocs = documents.filter(doc => documentIds.includes(doc.id));
    
    if (selectedDocs.length === 0) {
      throw new Error('Documents not found');
    }
    
    // Create mock task
    const task = {
      id: generateId(),
      task_type: `document_${action}`,
      status: 'processing',
      progress: 0,
      user_id: 'demo_user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      result: null,
      error: null
    };
    
    // Save task
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, []);
    tasks.unshift(task);
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    
    // Add activity
    const activities = getFromStorage(STORAGE_KEYS.ACTIVITIES, []);
    activities.unshift({
      id: generateId(),
      user_id: 'demo_user',
      action: `Document ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      description: `Started ${action} for ${selectedDocs.length} document(s)`,
      activity_type: action,
      actor: 'ai',
      files: selectedDocs.map(doc => doc.original_filename),
      created_at: new Date().toISOString(),
      metadata: { document_count: selectedDocs.length }
    });
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
    
    // Simulate task completion after delay
    setTimeout(() => {
      const updatedTasks = getFromStorage(STORAGE_KEYS.TASKS, []);
      const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
      
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          status: 'completed',
          progress: 100,
          result: {
            action,
            message: mockActionResponses[action]?.[Math.floor(Math.random() * mockActionResponses[action].length)] || `${action} completed successfully`,
            documents: selectedDocs.length
          },
          updated_at: new Date().toISOString()
        };
        
        saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
      }
    }, 3000);
    
    return {
      task_id: task.id,
      status: 'processing',
      message: `Started ${action} for ${selectedDocs.length} document(s)`
    };
  }
};

export const mockVoiceService = {
  processCommand: async (command, sessionId = null, context = {}) => {
    await delay(1000);
    
    const commandLower = command.toLowerCase();
    let intent = 'general_query';
    let parameters = {};
    let response = `I understand you want to: ${command}. Let me help you with that.`;
    let documents = [];
    let actions = [];
    
    // Process different command types
    if (commandLower.includes('find') || commandLower.includes('search')) {
      intent = 'search_documents';
      
      if (commandLower.includes('contract')) {
        parameters = { query: 'contract', category: 'contracts' };
        response = 'I found several contracts. Let me show you the most relevant ones.';
        documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, []).filter(doc => 
          doc.category === 'contracts'
        ).slice(0, 3);
      } else if (commandLower.includes('invoice')) {
        parameters = { query: 'invoice', category: 'invoices' };
        response = 'I found invoices in your document library. Here are the recent ones.';
        documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, []).filter(doc => 
          doc.category === 'invoices'
        ).slice(0, 3);
      } else if (commandLower.includes('compliance')) {
        parameters = { query: 'compliance', category: 'compliance' };
        response = 'I found compliance documents that need your attention.';
        documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, []).filter(doc => 
          doc.category === 'compliance'
        ).slice(0, 3);
      } else if (commandLower.includes('hr')) {
        parameters = { query: 'hr', category: 'hr' };
        response = 'I found HR documents in your library.';
        documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, []).filter(doc => 
          doc.category === 'hr'
        ).slice(0, 3);
      }
    } else if (commandLower.includes('merge')) {
      intent = 'merge_documents';
      parameters = { action: 'merge' };
      response = 'I\'ll merge the related documents for you. Please review the merged document.';
      actions = ['merge'];
      
      if (commandLower.includes('invoice')) {
        documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, []).filter(doc => 
          doc.category === 'invoices'
        ).slice(0, 3);
      }
    } else if (commandLower.includes('summarize')) {
      intent = 'summarize_documents';
      parameters = { action: 'summarize' };
      response = 'I\'ll create a summary of the documents. This may take a moment.';
      actions = ['summarize'];
      
      if (commandLower.includes('hr')) {
        documents = getFromStorage(STORAGE_KEYS.DOCUMENTS, []).filter(doc => 
          doc.category === 'hr'
        ).slice(0, 3);
      }
    }
    
    // Add voice command activity
    const activities = getFromStorage(STORAGE_KEYS.ACTIVITIES, []);
    activities.unshift({
      id: generateId(),
      user_id: 'demo_user',
      action: 'Voice Command Processed',
      description: `Processed voice command: "${command}"`,
      activity_type: 'voice_command',
      actor: 'ai',
      files: [],
      created_at: new Date().toISOString(),
      metadata: { 
        intent, 
        confidence: Math.random() * 0.2 + 0.8,
        documents_found: documents.length 
      }
    });
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
    
    return {
      intent,
      parameters,
      response,
      documents,
      actions,
      confidence: Math.random() * 0.2 + 0.8
    };
  }
};

export const mockActivityService = {
  list: async (limit = 50, activityType = null) => {
    await delay(600);
    
    let activities = getFromStorage(STORAGE_KEYS.ACTIVITIES, mockActivities);
    
    if (activityType) {
      activities = activities.filter(activity => activity.activity_type === activityType);
    }
    
    return activities.slice(0, limit);
  },

  getMemories: async (limit = 50, memoryType = null, starred = null) => {
    await delay(400);
    
    let memories = getFromStorage(STORAGE_KEYS.MEMORIES, mockMemories);
    
    if (memoryType) {
      memories = memories.filter(memory => memory.memory_type === memoryType);
    }
    
    if (starred !== null) {
      memories = memories.filter(memory => memory.starred === starred);
    }
    
    return memories.slice(0, limit);
  },

  createMemory: async (title, content, memoryType, tags = [], starred = false) => {
    await delay(800);
    
    const memory = {
      id: generateId(),
      user_id: 'demo_user',
      title,
      content,
      memory_type: memoryType,
      tags,
      starred,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {}
    };
    
    const memories = getFromStorage(STORAGE_KEYS.MEMORIES, []);
    memories.unshift(memory);
    saveToStorage(STORAGE_KEYS.MEMORIES, memories);
    
    return memory;
  }
};

export const mockTaskService = {
  list: async (limit = 50, status = null) => {
    await delay(500);
    
    let tasks = getFromStorage(STORAGE_KEYS.TASKS, mockTasks);
    
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    
    return tasks.slice(0, limit);
  },

  getById: async (taskId) => {
    await delay(300);
    
    const tasks = getFromStorage(STORAGE_KEYS.TASKS, mockTasks);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    return task;
  }
};

// Initialize mock data when service is imported
initializeMockData();

export { mockUpcomingTasks, mockAgentActions, mockAnalytics };