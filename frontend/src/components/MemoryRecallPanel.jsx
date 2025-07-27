import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Brain, Search, Bookmark, History, Repeat, Star, Clock } from 'lucide-react';

const MemoryRecallPanel = ({ memories = [], onRecallMemory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('recent');

  const filteredMemories = memories.filter(memory => 
    memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getMemoryIcon = (type) => {
    switch (type) {
      case 'summary': return <Brain className="w-4 h-4" />;
      case 'routine': return <Repeat className="w-4 h-4" />;
      case 'bookmark': return <Bookmark className="w-4 h-4" />;
      case 'history': return <History className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getMemoryColor = (type) => {
    switch (type) {
      case 'summary': return 'bg-purple-100 text-purple-800';
      case 'routine': return 'bg-green-100 text-green-800';
      case 'bookmark': return 'bg-blue-100 text-blue-800';
      case 'history': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'recent', label: 'Recent', icon: <Clock className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'routines', label: 'Routines', icon: <Repeat className="w-4 h-4" /> },
    { id: 'starred', label: 'Starred', icon: <Star className="w-4 h-4" /> },
  ];

  const getTabMemories = (tabId) => {
    switch (tabId) {
      case 'bookmarks': return filteredMemories.filter(m => m.type === 'bookmark');
      case 'routines': return filteredMemories.filter(m => m.type === 'routine');
      case 'starred': return filteredMemories.filter(m => m.starred);
      default: return filteredMemories;
    }
  };

  const MemoryItem = ({ memory }) => (
    <div className="space-y-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => onRecallMemory(memory)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${getMemoryColor(memory.type)}`}>
            {getMemoryIcon(memory.type)}
          </div>
          <h3 className="font-medium text-sm">{memory.title}</h3>
        </div>
        {memory.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{memory.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {memory.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {memory.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{memory.tags.length - 2}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{memory.timestamp}</span>
      </div>
    </div>
  );

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Memory Recall
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={selectedTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTab(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>
        
        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-2">
            {getTabMemories(selectedTab).map((memory, index) => (
              <div key={index}>
                <MemoryItem memory={memory} />
                {index < getTabMemories(selectedTab).length - 1 && <Separator className="my-2" />}
              </div>
            ))}
            {getTabMemories(selectedTab).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No memories found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MemoryRecallPanel;