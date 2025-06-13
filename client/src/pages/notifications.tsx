import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Check, X, Settings, AlertCircle, Users, FileText, Vote } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Notification {
  id: number;
  type: 'bill' | 'petition' | 'election' | 'politician' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'bills' | 'petitions'>('all');
  const queryClient = useQueryClient();

  // Mock notifications with real civic data
  const mockNotifications: Notification[] = [
    {
      id: 1,
      type: 'bill',
      title: 'Bill C-11 Update',
      message: 'Online Streaming Act has passed second reading in Parliament',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'petition',
      title: 'Petition Milestone',
      message: 'Climate Action petition has reached 10,000 signatures',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'politician',
      title: 'New MP Statement',
      message: 'Chrystia Freeland released statement on economic policy',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'election',
      title: 'Electoral Boundary Update',
      message: 'New federal electoral boundaries finalized for 2025',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'low'
    },
    {
      id: 5,
      type: 'system',
      title: 'Data Update Complete',
      message: 'Weekly sync of government data completed - 342 MPs updated',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'low'
    }
  ];

  const filteredNotifications = mockNotifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'bills') return notification.type === 'bill';
    if (filter === 'petitions') return notification.type === 'petition';
    return true;
  });

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bill': return <FileText className="w-4 h-4" />;
      case 'petition': return <Vote className="w-4 h-4" />;
      case 'politician': return <Users className="w-4 h-4" />;
      case 'election': return <Vote className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on civic activities and government changes
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: mockNotifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'bills', label: 'Bills', count: mockNotifications.filter(n => n.type === 'bill').length },
              { key: 'petitions', label: 'Petitions', count: mockNotifications.filter(n => n.type === 'petition').length }
            ].map(tab => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className="space-x-2"
              >
                <span>{tab.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground text-center">
                You're all caught up! Check back later for updates on civic activities.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                          {notification.priority}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <Button variant="ghost" size="sm">
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Notification Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push notifications</p>
              <p className="text-sm text-muted-foreground">Browser notifications for urgent updates</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Bill updates</p>
              <p className="text-sm text-muted-foreground">Notify when bills change status</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}