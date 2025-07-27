import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, FileText, Clock, Zap, TrendingUp, Command } from 'lucide-react';

const AnalyticsSnapshot = ({ analytics = {} }) => {
  const {
    totalDocuments = 0,
    documentsProcessed = 0,
    timeSaved = 0,
    commandsUsed = 0,
    mostUsedCommands = [],
    weeklyActivity = [],
    fileTypes = []
  } = analytics;

  const StatCard = ({ title, value, unit, icon: Icon, color = "bg-blue-100 text-blue-800" }) => (
    <div className="p-4 rounded-lg border bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value}
            <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  const getMaxActivity = () => {
    return Math.max(...weeklyActivity.map(day => day.actions), 1);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Analytics Snapshot
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Usage metrics and insights
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Documents"
            value={totalDocuments}
            icon={FileText}
            color="bg-blue-100 text-blue-800"
          />
          <StatCard
            title="Processed This Week"
            value={documentsProcessed}
            icon={Zap}
            color="bg-green-100 text-green-800"
          />
          <StatCard
            title="Time Saved"
            value={timeSaved}
            unit="hours"
            icon={Clock}
            color="bg-purple-100 text-purple-800"
          />
          <StatCard
            title="Commands Used"
            value={commandsUsed}
            icon={Command}
            color="bg-orange-100 text-orange-800"
          />
        </div>

        {/* Weekly Activity */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Weekly Activity</h4>
          <div className="space-y-2">
            {weeklyActivity.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{day.day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(day.actions / getMaxActivity()) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">
                  {day.actions}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Used Commands */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Most Used Commands</h4>
          <div className="space-y-2">
            {mostUsedCommands.map((cmd, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-sm">{cmd.command}</span>
                <Badge variant="secondary" className="text-xs">
                  {cmd.count} times
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* File Types Distribution */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">File Types Processed</h4>
          <div className="space-y-3">
            {fileTypes.map((type, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{type.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{type.count} files</span>
                    <Badge variant="outline" className="text-xs">
                      {type.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={type.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency Insight */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <h4 className="font-medium text-sm text-green-800">Efficiency Insight</h4>
          </div>
          <p className="text-sm text-green-700">
            You've saved {timeSaved} hours this week through AI-powered document processing. 
            That's equivalent to {Math.round(timeSaved / 8)} full working days!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSnapshot;