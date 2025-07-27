import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../hooks/useDocuments';
import { useActivities, useMemories } from '../hooks/useActivities';
import { useTasks } from '../hooks/useTasks';
import { useVoice } from '../hooks/useVoice';
import VoiceCommandConsole from './VoiceCommandConsole';
import SmartFileActivityFeed from './SmartFileActivityFeed';
import DocumentLibrary from './DocumentLibrary';
import MemoryRecallPanel from './MemoryRecallPanel';
import AgentToolkit from './AgentToolkit';
import UpcomingTasksPanel from './UpcomingTasksPanel';
import AnalyticsSnapshot from './AnalyticsSnapshot';
import LoginModal from './LoginModal';
import { 
  Brain, 
  Settings, 
  User, 
  Bell, 
  Loader2
} from 'lucide-react';

const FileClerkAIDashboard = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { toast } = useToast();
  
  // Auth
  const { user, isAuthenticated, loading: authLoading, createSession } = useAuth();
  
  // Data hooks
  const { documents, loading: documentsLoading, uploadDocument, searchDocuments, performDocumentAction } = useDocuments();
  const { activities, loading: activitiesLoading } = useActivities();
  const { memories, loading: memoriesLoading } = useMemories();
  const { tasks, loading: tasksLoading } = useTasks();
  const { processCommand, loading: voiceLoading } = useVoice();

  // Auto-create session on mount if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      createSession()
        .then(() => {
          console.log('Session created successfully');
        })
        .catch((error) => {
          console.error('Session creation failed:', error);
          setShowLogin(true);
        });
    }
  }, [authLoading, isAuthenticated, createSession]);

  const handleVoiceCommand = async (command) => {
    try {
      const result = await processCommand(command);
      
      // Handle different intents
      if (result.intent === 'search_documents' && result.documents?.length > 0) {
        setSelectedDocument(result.documents[0]);
      } else if (result.intent === 'merge_documents' && result.documents?.length > 0) {
        // Start merge action
        const documentIds = result.documents.map(doc => doc.id);
        await performDocumentAction('merge', documentIds);
      } else if (result.intent === 'summarize_documents' && result.documents?.length > 0) {
        // Start summarize action
        const documentIds = result.documents.map(doc => doc.id);
        await performDocumentAction('summarize', documentIds);
      }
      
      return result;
    } catch (error) {
      console.error('Voice command error:', error);
    }
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleMemoryRecall = (memory) => {
    toast({
      title: "Memory Recalled",
      description: `Loaded: ${memory.title}`,
    });
  };

  const handleAgentAction = async (action, document) => {
    try {
      await performDocumentAction(action.name.toLowerCase(), [document.id]);
    } catch (error) {
      console.error('Agent action error:', error);
    }
  };

  const handleTaskAction = (task, action) => {
    toast({
      title: "Task Action",
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} action taken on: ${task.title}`,
    });
  };

  const handleFileUpload = async (file) => {
    try {
      await uploadDocument(file);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  // Mock analytics data - in real app, this would come from API
  const mockAnalytics = {
    totalDocuments: documents.length,
    documentsProcessed: tasks.filter(t => t.status === 'completed').length,
    timeSaved: 24.5,
    commandsUsed: activities.filter(a => a.activity_type === 'voice_command').length,
    mostUsedCommands: [
      { command: 'Find contracts', count: 42 },
      { command: 'Merge invoices', count: 38 },
      { command: 'Summarize documents', count: 31 },
      { command: 'Send to team', count: 28 },
      { command: 'Review compliance', count: 17 }
    ],
    weeklyActivity: [
      { day: 'Mon', actions: 23 },
      { day: 'Tue', actions: 31 },
      { day: 'Wed', actions: 18 },
      { day: 'Thu', actions: 42 },
      { day: 'Fri', actions: 35 },
      { day: 'Sat', actions: 8 },
      { day: 'Sun', actions: 5 }
    ],
    fileTypes: [
      { type: 'PDF', count: 687, percentage: 55 },
      { type: 'DOCX', count: 312, percentage: 25 },
      { type: 'XLSX', count: 186, percentage: 15 },
      { type: 'Others', count: 62, percentage: 5 }
    ]
  };

  // Mock upcoming tasks based on documents
  const mockUpcomingTasks = [
    {
      id: 1,
      title: '3 files awaiting signature',
      description: 'Vendor contracts need to be signed by end of week',
      priority: 'high',
      dueDate: '2024-12-15',
      files: ['Contract_VendorB.pdf', 'Contract_VendorC.pdf', 'Service_Agreement.pdf'],
      type: 'signature'
    },
    {
      id: 2,
      title: '2 conflicting file versions flagged',
      description: 'Multiple versions of the same document detected',
      priority: 'medium',
      dueDate: '2024-12-16',
      files: ['Policy_v1.pdf', 'Policy_v2.pdf'],
      type: 'conflict'
    }
  ];

  // Mock agent actions
  const mockAgentActions = [
    {
      id: 1,
      name: 'Summarize',
      description: 'Create AI-powered summary of document content',
      icon: 'FileText',
      category: 'analysis'
    },
    {
      id: 2,
      name: 'Compare',
      description: 'Compare two or more documents for differences',
      icon: 'GitCompare',
      category: 'analysis'
    },
    {
      id: 3,
      name: 'Convert',
      description: 'Convert document to different format',
      icon: 'RefreshCw',
      category: 'transform'
    },
    {
      id: 4,
      name: 'Merge',
      description: 'Combine multiple documents into one',
      icon: 'Merge',
      category: 'transform'
    },
    {
      id: 5,
      name: 'Redact',
      description: 'Remove sensitive information from document',
      icon: 'EyeOff',
      category: 'security'
    },
    {
      id: 6,
      name: 'Send',
      description: 'Share document with team members',
      icon: 'Send',
      category: 'communication'
    }
  ];

  // Show login modal if not authenticated
  if (showLogin) {
    return <LoginModal onClose={() => setShowLogin(false)} />;
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading FileClerkAI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">FileClerkAI</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Document Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                Analytics
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Voice Command and Memory */}
          <div className="lg:col-span-1 space-y-6">
            <VoiceCommandConsole 
              onCommand={handleVoiceCommand} 
              loading={voiceLoading}
            />
            <MemoryRecallPanel 
              memories={memories} 
              onRecallMemory={handleMemoryRecall}
              loading={memoriesLoading}
            />
            {showAnalytics && (
              <AnalyticsSnapshot analytics={mockAnalytics} />
            )}
          </div>

          {/* Center Column - Document Library and Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <DocumentLibrary 
              documents={documents} 
              onDocumentSelect={handleDocumentSelect}
              onFileUpload={handleFileUpload}
              loading={documentsLoading}
            />
            <SmartFileActivityFeed 
              activities={activities}
              loading={activitiesLoading}
            />
          </div>

          {/* Right Column - Agent Toolkit and Tasks */}
          <div className="lg:col-span-1 space-y-6">
            <AgentToolkit 
              selectedDocument={selectedDocument}
              agentActions={mockAgentActions}
              onActionComplete={handleAgentAction}
            />
            <UpcomingTasksPanel 
              tasks={mockUpcomingTasks}
              onTaskAction={handleTaskAction}
            />
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">
              AI Status: Active
            </Badge>
            <span className="text-xs text-muted-foreground">
              {documents.length} documents indexed
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Last sync: Just now
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileClerkAIDashboard;