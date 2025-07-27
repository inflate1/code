import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { 
  Brain, 
  Upload, 
  Mic, 
  FileText, 
  TestTube,
  Play,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

const MockModeDemo = () => {
  const [documents, setDocuments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Mock data
  const mockDocs = [
    { id: 1, name: 'ACME Contract Q4.pdf', category: 'contracts', status: 'signed' },
    { id: 2, name: 'Invoice_VendorA_001.pdf', category: 'invoices', status: 'pending' },
    { id: 3, name: 'HR_Onboarding_John.docx', category: 'hr', status: 'processed' },
    { id: 4, name: 'Compliance_Report_Q4.pdf', category: 'compliance', status: 'urgent' }
  ];

  const mockActivities = [
    { id: 1, action: 'Document Uploaded', description: 'Uploaded ACME Contract Q4.pdf', time: '2 min ago' },
    { id: 2, action: 'Voice Command', description: 'Processed: "Find contracts"', time: '5 min ago' },
    { id: 3, action: 'Document Merged', description: 'Merged 3 invoices into single PDF', time: '10 min ago' }
  ];

  useEffect(() => {
    // Initialize with mock data
    setDocuments(mockDocs);
    setActivities(mockActivities);
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDoc = {
      id: Date.now(),
      name: file.name,
      category: 'general',
      status: 'uploaded'
    };
    
    setDocuments(prev => [newDoc, ...prev]);
    
    const newActivity = {
      id: Date.now(),
      action: 'Document Uploaded',
      description: `Uploaded ${file.name}`,
      time: 'Just now'
    };
    
    setActivities(prev => [newActivity, ...prev]);
    
    setIsProcessing(false);
    
    toast({
      title: "Success",
      description: `${file.name} uploaded successfully!`
    });
  };

  const handleVoiceCommand = async () => {
    if (!command.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate voice processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let response = `Processed: "${command}"`;
    let foundDocs = [];
    
    if (command.toLowerCase().includes('contract')) {
      foundDocs = documents.filter(doc => doc.category === 'contracts');
      response = `Found ${foundDocs.length} contracts`;
    } else if (command.toLowerCase().includes('invoice')) {
      foundDocs = documents.filter(doc => doc.category === 'invoices');
      response = `Found ${foundDocs.length} invoices`;
    } else if (command.toLowerCase().includes('merge')) {
      response = 'Starting merge operation...';
    }
    
    const newActivity = {
      id: Date.now(),
      action: 'Voice Command',
      description: response,
      time: 'Just now'
    };
    
    setActivities(prev => [newActivity, ...prev]);
    setCommand('');
    setIsProcessing(false);
    
    toast({
      title: "Command Processed",
      description: response
    });
  };

  const runDemo = async () => {
    // Simulate a complete workflow
    setIsProcessing(true);
    
    // Step 1: Voice command
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCommand('Find all contracts');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    const activity1 = {
      id: Date.now(),
      action: 'Voice Command',
      description: 'Processed: "Find all contracts"',
      time: 'Just now'
    };
    setActivities(prev => [activity1, ...prev]);
    
    // Step 2: Document action
    await new Promise(resolve => setTimeout(resolve, 1500));
    const activity2 = {
      id: Date.now() + 1,
      action: 'Document Summarized',
      description: 'Generated summary for ACME Contract Q4.pdf',
      time: 'Just now'
    };
    setActivities(prev => [activity2, ...prev]);
    
    // Step 3: Memory saved
    await new Promise(resolve => setTimeout(resolve, 1000));
    const activity3 = {
      id: Date.now() + 2,
      action: 'Memory Saved',
      description: 'Saved contract summary to memory bank',
      time: 'Just now'
    };
    setActivities(prev => [activity3, ...prev]);
    
    setCommand('');
    setIsProcessing(false);
    
    toast({
      title: "Demo Complete!",
      description: "Full workflow demonstration finished"
    });
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
                <p className="text-sm text-muted-foreground">Mock Mode Demo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Mock Mode Active
              </Badge>
              <Button onClick={runDemo} disabled={isProcessing}>
                <Play className="w-4 h-4 mr-2" />
                Run Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voice Command Console */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Command Console
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Try: Find contracts, Merge invoices..."
                  disabled={isProcessing}
                />
                <Button onClick={handleVoiceCommand} disabled={!command.trim() || isProcessing}>
                  {isProcessing ? <Clock className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Try these commands:</h4>
                <div className="grid gap-2">
                  {['Find contracts', 'Merge invoices', 'Summarize HR docs'].map((cmd) => (
                    <Button
                      key={cmd}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCommand(cmd)}
                      className="justify-start text-xs"
                    >
                      "{cmd}"
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Library */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  onClick={() => document.getElementById('file-upload').click()}
                  disabled={isProcessing}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
              </div>
              
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">{doc.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{activity.action}</h4>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Demo */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎤 Voice Commands</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use natural language to interact with your documents
              </p>
              <ul className="text-sm space-y-1">
                <li>• "Find contracts from last month"</li>
                <li>• "Merge all invoices from Vendor A"</li>
                <li>• "Summarize HR onboarding docs"</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📄 Smart Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                AI automatically categorizes and processes documents
              </p>
              <ul className="text-sm space-y-1">
                <li>• Auto-categorization by content</li>
                <li>• Smart tag generation</li>
                <li>• Text extraction and indexing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🧠 Memory System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Persistent memory for workflows and insights
              </p>
              <ul className="text-sm space-y-1">
                <li>• Save document summaries</li>
                <li>• Create reusable routines</li>
                <li>• Bookmark important findings</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MockModeDemo;