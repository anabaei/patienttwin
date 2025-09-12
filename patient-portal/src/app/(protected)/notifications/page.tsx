"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Filter,
  Info,
  MapPin,
  Shield,
  X
} from "lucide-react";
import { useState } from "react";

type NotificationType = 'appointment' | 'insurance' | 'payment' | 'clinic' | 'system';
type Priority = 'high' | 'medium' | 'low';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: Priority;
  icon: any;
  action: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment' as NotificationType,
    title: 'Appointment Reminder',
    message: 'Your appointment with Dr. Amelia Chen is tomorrow at 2:00 PM',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: 'high' as Priority,
    icon: Calendar,
    action: 'View Details'
  },
  {
    id: '2',
    type: 'insurance' as NotificationType,
    title: 'Insurance Coverage Updated',
    message: 'Your SunLife Financial coverage has been updated. New benefits are now active.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    priority: 'medium' as Priority,
    icon: Shield,
    action: 'Review Coverage'
  },
  {
    id: '3',
    type: 'payment' as NotificationType,
    title: 'Payment Confirmed',
    message: 'Your payment of $25.80 for the consultation has been processed successfully.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: 'low' as Priority,
    icon: CreditCard,
    action: 'View Receipt'
  },
  {
    id: '4',
    type: 'clinic' as NotificationType,
    title: 'New Clinic Available',
    message: 'City Health Center is now accepting new patients in your area.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    priority: 'low' as Priority,
    icon: MapPin,
    action: 'View Clinic'
  },
  {
    id: '5',
    type: 'appointment' as NotificationType,
    title: 'Appointment Cancelled',
    message: 'Your appointment with Dr. Michael Rodriguez on Dec 15th has been cancelled.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    priority: 'medium' as Priority,
    icon: AlertCircle,
    action: 'Reschedule'
  },
  {
    id: '6',
    type: 'system' as NotificationType,
    title: 'App Update Available',
    message: 'A new version of the app is available with improved features and bug fixes.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    read: true,
    priority: 'low' as Priority,
    icon: Info,
    action: 'Update Now'
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'insurance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'payment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'clinic': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'system': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your healthcare activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter:</span>
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'appointment', label: 'Appointments', count: notifications.filter(n => n.type === 'appointment').length },
              { key: 'insurance', label: 'Insurance', count: notifications.filter(n => n.type === 'insurance').length },
              { key: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
              { key: 'clinic', label: 'Clinics', count: notifications.filter(n => n.type === 'clinic').length },
              { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
            ].map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(key as any)}
                className="h-8"
              >
                {label}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'unread' 
                  ? "You're all caught up! No unread notifications."
                  : "No notifications match your current filter."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <Card key={notification.id} className={`transition-all hover:shadow-md ${!notification.read ? 'ring-2 ring-primary/20' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                            <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                              {notification.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {notification.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          {notification.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how you receive updates and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Button variant="outline" onClick={() => window.location.href = '/settings'}>
              <Bell className="h-4 w-4 mr-2" />
              Manage Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
