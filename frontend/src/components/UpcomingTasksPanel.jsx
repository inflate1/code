import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Calendar, AlertTriangle, Clock, CheckCircle, FileText, Archive, GitMerge, PenTool } from 'lucide-react';

const UpcomingTasksPanel = ({ tasks = [], onTaskAction }) => {
  const [expandedTask, setExpandedTask] = useState(null);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'signature': return <PenTool className="w-4 h-4" />;
      case 'conflict': return <GitMerge className="w-4 h-4" />;
      case 'review': return <FileText className="w-4 h-4" />;
      case 'archive': return <Archive className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTaskTypeColor = (type) => {
    switch (type) {
      case 'signature': return 'bg-blue-100 text-blue-800';
      case 'conflict': return 'bg-orange-100 text-orange-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'archive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleTaskAction = (task, action) => {
    onTaskAction(task, action);
  };

  const TaskItem = ({ task }) => {
    const daysUntilDue = getDaysUntilDue(task.dueDate);
    const isOverdue = daysUntilDue < 0;
    const isUrgent = daysUntilDue <= 2 && daysUntilDue >= 0;

    return (
      <div className="space-y-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${getTaskTypeColor(task.type)}`}>
              {getTaskIcon(task.type)}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{task.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
            {isUrgent && (
              <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                Urgent
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Due: {task.dueDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
             daysUntilDue === 0 ? 'Due today' : 
             `${daysUntilDue} days left`}
          </div>
          {task.files && task.files.length > 0 && (
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {task.files.length} file{task.files.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {task.files && task.files.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.files.map((file, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {file}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleTaskAction(task, 'view')}
            className="text-xs"
          >
            View Details
          </Button>
          {task.type === 'signature' && (
            <Button
              size="sm"
              onClick={() => handleTaskAction(task, 'sign')}
              className="text-xs"
            >
              <PenTool className="w-3 h-3 mr-1" />
              Sign
            </Button>
          )}
          {task.type === 'conflict' && (
            <Button
              size="sm"
              onClick={() => handleTaskAction(task, 'resolve')}
              className="text-xs"
            >
              <GitMerge className="w-3 h-3 mr-1" />
              Resolve
            </Button>
          )}
          {task.type === 'review' && (
            <Button
              size="sm"
              onClick={() => handleTaskAction(task, 'review')}
              className="text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              Review
            </Button>
          )}
          {task.type === 'archive' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleTaskAction(task, 'archive')}
              className="text-xs"
            >
              <Archive className="w-3 h-3 mr-1" />
              Archive
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Upcoming Tasks
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} requiring attention
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming tasks</p>
                <p className="text-xs mt-2">All caught up!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UpcomingTasksPanel;