import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { FileText, GitCompare, RefreshCw, Merge, EyeOff, Send, Download, Languages, Bot, Check, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AgentToolkit = ({ selectedDocument, agentActions = [], onActionComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);
  const [pendingApproval, setPendingApproval] = useState(null);
  const { toast } = useToast();

  const getActionIcon = (iconName) => {
    const icons = {
      FileText: <FileText className="w-4 h-4" />,
      GitCompare: <GitCompare className="w-4 h-4" />,
      RefreshCw: <RefreshCw className="w-4 h-4" />,
      Merge: <Merge className="w-4 h-4" />,
      EyeOff: <EyeOff className="w-4 h-4" />,
      Send: <Send className="w-4 h-4" />,
      Download: <Download className="w-4 h-4" />,
      Languages: <Languages className="w-4 h-4" />
    };
    return icons[iconName] || <FileText className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'analysis': return 'bg-blue-100 text-blue-800';
      case 'transform': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'communication': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = async (action) => {
    setIsProcessing(true);
    setProcessingAction(action);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate requiring user approval for certain actions
    if (['merge', 'redact', 'send'].includes(action.name.toLowerCase())) {
      setPendingApproval({
        action,
        result: `${action.name} operation completed successfully. Please review the result.`,
        preview: `Preview of ${action.name} operation on ${selectedDocument?.name}`
      });
    } else {
      // Auto-approve other actions
      handleApproval(action, true);
    }

    setIsProcessing(false);
    setProcessingAction(null);
  };

  const handleApproval = (action, approved) => {
    if (approved) {
      toast({
        title: "Action Approved",
        description: `${action.name} completed successfully on ${selectedDocument?.name}`,
      });
      onActionComplete(action, selectedDocument);
    } else {
      toast({
        title: "Action Rejected",
        description: `${action.name} operation was cancelled`,
        variant: "destructive",
      });
    }
    setPendingApproval(null);
  };

  const groupedActions = agentActions.reduce((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {});

  if (!selectedDocument) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Agent Toolkit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a document to see available actions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Agent Toolkit
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Actions available for: <span className="font-medium">{selectedDocument.name}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedActions).map(([category, actions]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getCategoryColor(category)}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(action)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 h-auto p-3 text-left justify-start"
                >
                  {processingAction?.id === action.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    getActionIcon(action.icon)
                  )}
                  <div>
                    <div className="font-medium text-xs">{action.name}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
            <Separator />
          </div>
        ))}

        {/* Pending Approval Dialog */}
        {pendingApproval && (
          <Dialog open={!!pendingApproval} onOpenChange={() => setPendingApproval(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Action Requires Approval</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Action: {pendingApproval.action.name}</h4>
                  <p className="text-sm text-muted-foreground">{pendingApproval.result}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Preview:</h4>
                  <p className="text-sm text-blue-700">{pendingApproval.preview}</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleApproval(pendingApproval.action, false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApproval(pendingApproval.action, true)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentToolkit;