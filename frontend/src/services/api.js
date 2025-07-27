import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
let authToken = localStorage.getItem('fileclerk_token');

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      authToken = null;
      localStorage.removeItem('fileclerk_token');
      // Could trigger a global auth state update here
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  createSession: async () => {
    const response = await api.post('/auth/session');
    const { token } = response.data;
    
    // Store token
    authToken = token;
    localStorage.setItem('fileclerk_token', token);
    
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    
    // Store token
    authToken = token;
    localStorage.setItem('fileclerk_token', token);
    
    return response.data;
  },

  getCurrentSession: async () => {
    const response = await api.get('/auth/session');
    return response.data;
  },

  logout: async () => {
    try {
      await api.delete('/auth/session');
    } finally {
      authToken = null;
      localStorage.removeItem('fileclerk_token');
    }
  },

  getUserSettings: async () => {
    const response = await api.get('/auth/user/settings');
    return response.data;
  },

  updateUserSettings: async (settings) => {
    const response = await api.put('/auth/user/settings', { settings });
    return response.data;
  }
};

// Documents API
export const documentsAPI = {
  upload: async (file, category = 'general', tags = [], autoCategories = true) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags));
    formData.append('auto_categorize', autoCategories);

    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  list: async (category = null, tags = null, limit = 50) => {
    const params = { limit };
    if (category) params.category = category;
    if (tags) params.tags = tags.join(',');

    const response = await api.get('/documents/', { params });
    return response.data;
  },

  getById: async (documentId) => {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  },

  search: async (query, categories = null, tags = null, limit = 10, includeContent = false) => {
    const searchData = {
      query,
      categories,
      tags,
      limit,
      include_content: includeContent
    };

    const response = await api.post('/documents/search', searchData);
    return response.data;
  },

  performAction: async (action, documentIds, parameters = {}) => {
    const actionData = {
      action,
      document_ids: documentIds,
      parameters
    };

    const response = await api.post('/documents/action', actionData);
    return response.data;
  },

  delete: async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  },

  download: async (documentId) => {
    const response = await api.get(`/documents/${documentId}/download`);
    return response.data;
  },

  getFile: async (documentId) => {
    const response = await api.get(`/documents/${documentId}/file`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Voice API
export const voiceAPI = {
  processCommand: async (command, sessionId = null, context = {}) => {
    const commandData = {
      command,
      session_id: sessionId,
      context
    };

    const response = await api.post('/voice/command', commandData);
    return response.data;
  },

  transcribeAudio: async (audioFile) => {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await api.post('/voice/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  textToSpeech: async (text, voice = 'default') => {
    const ttsData = { text, voice };
    const response = await api.post('/voice/text-to-speech', ttsData);
    return response.data;
  },

  getAudio: async (audioId) => {
    const response = await api.get(`/voice/audio/${audioId}`);
    return response.data;
  },

  getSupportedLanguages: async () => {
    const response = await api.get('/voice/supported-languages');
    return response.data;
  }
};

// Tasks API
export const tasksAPI = {
  list: async (limit = 50, status = null) => {
    const params = { limit };
    if (status) params.status = status;

    const response = await api.get('/tasks/', { params });
    return response.data;
  },

  getById: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  cancel: async (taskId) => {
    const response = await api.post(`/tasks/${taskId}/cancel`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/tasks/stats/summary');
    return response.data;
  },

  cleanup: async (days = 7) => {
    const response = await api.post('/tasks/cleanup', null, {
      params: { days }
    });
    return response.data;
  }
};

// Activities API
export const activitiesAPI = {
  list: async (limit = 50, activityType = null) => {
    const params = { limit };
    if (activityType) params.activity_type = activityType;

    const response = await api.get('/activities/', { params });
    return response.data;
  },

  getSummary: async (days = 7) => {
    const response = await api.get('/activities/summary', {
      params: { days }
    });
    return response.data;
  },

  getMemories: async (limit = 50, memoryType = null, starred = null) => {
    const params = { limit };
    if (memoryType) params.memory_type = memoryType;
    if (starred !== null) params.starred = starred;

    const response = await api.get('/activities/memories', { params });
    return response.data;
  },

  createMemory: async (title, content, memoryType, tags = [], starred = false, metadata = {}) => {
    const memoryData = {
      title,
      content,
      memory_type: memoryType,
      tags,
      starred,
      metadata
    };

    const response = await api.post('/activities/memories', memoryData);
    return response.data;
  },

  getMemoryById: async (memoryId) => {
    const response = await api.get(`/activities/memories/${memoryId}`);
    return response.data;
  },

  updateMemory: async (memoryId, updates) => {
    const response = await api.put(`/activities/memories/${memoryId}`, updates);
    return response.data;
  },

  deleteMemory: async (memoryId) => {
    const response = await api.delete(`/activities/memories/${memoryId}`);
    return response.data;
  },

  searchMemories: async (query, limit = 20) => {
    const response = await api.get(`/activities/memories/search/${encodeURIComponent(query)}`, {
      params: { limit }
    });
    return response.data;
  },

  createRoutineMemory: async (title, steps, tags = []) => {
    const routineData = { title, steps, tags };
    const response = await api.post('/activities/memories/routine', routineData);
    return response.data;
  },

  createSummaryMemory: async (title, summary, documentIds = [], tags = []) => {
    const summaryData = { title, summary, document_ids: documentIds, tags };
    const response = await api.post('/activities/memories/summary', summaryData);
    return response.data;
  },

  createBookmarkMemory: async (title, content, referenceId = null, tags = []) => {
    const bookmarkData = { title, content, reference_id: referenceId, tags };
    const response = await api.post('/activities/memories/bookmark', bookmarkData);
    return response.data;
  }
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  root: async () => {
    const response = await api.get('/');
    return response.data;
  }
};

// Export default api instance for custom calls
export default api;