import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { FileText, Download, Merge, FileCheck, Clock, User, Bot } from 'lucide-react';

const SmartFileActivityFeed = ({ activities = [] }) => {
  const [filter, setFilter] = useState('all');

  const getActivityIcon = (type) => {
    switch (type) {
      case 'retrieved': return <FileText className="w-4 h-4" />;
      case 'merged': return <Merge className="w-4 h-4" />;
      case 'summarized': return <FileCheck className="w-4 h-4" />;
      case 'sent': return <Download className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'retrieved': return 'bg-blue-100 text-blue-800';
      case 'merged': return 'bg-green-100 text-green-800';
      case 'summarized': return 'bg-purple-100 text-purple-800';
      case 'sent': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'retrieved', label: 'Retrieved' },
    { value: 'merged', label: 'Merged' },
    { value: 'summarized', label: 'Summarized' },
    { value: 'sent', label: 'Sent' }
  ];

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Smart File Activity Feed
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((option) => (
            <Badge
              key={option.value}
              variant={filter === option.value ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10"
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{activity.action}</span>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.timestamp}
                      </div>
                      <div className="flex items-center gap-1">
                        {activity.actor === 'ai' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {activity.actor === 'ai' ? 'FileClerkAI' : 'You'}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {activity.fileType}
                      </div>
                    </div>
                    {activity.files && activity.files.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {activity.files.map((file, fileIndex) => (
                          <Badge key={fileIndex} variant="secondary" className="text-xs">
                            {file}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {activity.userConfirmation && (
                      <div className="mt-2 p-2 bg-green-50 rounded-md">
                        <p className="text-xs text-green-700">
                          ✓ {activity.userConfirmation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {index < filteredActivities.length - 1 && <Separator />}
              </div>
            ))}
            {filteredActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No activities found for the selected filter</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SmartFileActivityFeed;