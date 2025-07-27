import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import VoiceCommandConsole from './VoiceCommandConsole';
import SmartFileActivityFeed from './SmartFileActivityFeed';
import DocumentLibrary from './DocumentLibrary';
import MemoryRecallPanel from './MemoryRecallPanel';
import AgentToolkit from './AgentToolkit';
import UpcomingTasksPanel from './UpcomingTasksPanel';
import AnalyticsSnapshot from './AnalyticsSnapshot';
import { 
  mockDocuments, 
  mockActivities, 
  mockMemories, 
  mockAnalytics, 
  mockUpcomingTasks, 
  mockAgentActions 
} from '../data/mockData';
import { Brain, Settings, User, Bell, Search } from 'lucide-react';

const FileClerkAIDashboard = () => {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activities, setActivities] = useState(mockActivities);
  const [memories, setMemories] = useState(mockMemories);
  const [upcomingTasks, setUpcomingTasks] = useState(mockUpcomingTasks);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();

  const handleVoiceCommand = (command) => {
    // Mock AI processing of voice commands
    const newActivity = {
      id: activities.length + 1,
      action: 'Voice Command Processed',
      description: `Processed command: "${command}"`,
      type: 'retrieved',
      timestamp: 'Just now',
      actor: 'ai',
      fileType: 'Command',
      files: []
    };

    setActivities([newActivity, ...activities]);

    // Mock finding relevant documents based on command
    if (command.toLowerCase().includes('acme')) {
      const acmeDoc = mockDocuments.find(doc => doc.name.toLowerCase().includes('acme'));
      if (acmeDoc) {
        setSelectedDocument(acmeDoc);
      }
    } else if (command.toLowerCase().includes('invoice')) {
      const invoiceDoc = mockDocuments.find(doc => doc.category === 'invoices');
      if (invoiceDoc) {
        setSelectedDocument(invoiceDoc);
      }
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

  const handleAgentAction = (action, document) => {
    const newActivity = {
      id: activities.length + 1,
      action: `${action.name} Completed`,
      description: `${action.name} performed on ${document.name}`,
      type: action.name.toLowerCase(),
      timestamp: 'Just now',
      actor: 'ai',
      fileType: document.type.toUpperCase(),
      files: [document.name]
    };

    setActivities([newActivity, ...activities]);
  };

  const handleTaskAction = (task, action) => {
    toast({
      title: "Task Action",
      description: `${action.charAt(0).toUpperCase() + action.slice(1)} action taken on: ${task.title}`,
    });

    // Remove task if it's completed
    if (action === 'sign' || action === 'resolve' || action === 'review') {
      setUpcomingTasks(upcomingTasks.filter(t => t.id !== task.id));
    }
  };

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
            <VoiceCommandConsole onCommand={handleVoiceCommand} />
            <MemoryRecallPanel 
              memories={memories} 
              onRecallMemory={handleMemoryRecall} 
            />
            {showAnalytics && (
              <AnalyticsSnapshot analytics={mockAnalytics} />
            )}
          </div>

          {/* Center Column - Document Library and Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <DocumentLibrary 
              documents={mockDocuments} 
              onDocumentSelect={handleDocumentSelect} 
            />
            <SmartFileActivityFeed activities={activities} />
          </div>

          {/* Right Column - Agent Toolkit and Tasks */}
          <div className="lg:col-span-1 space-y-6">
            <AgentToolkit 
              selectedDocument={selectedDocument}
              agentActions={mockAgentActions}
              onActionComplete={handleAgentAction}
            />
            <UpcomingTasksPanel 
              tasks={upcomingTasks}
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
              {mockDocuments.length} documents indexed
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