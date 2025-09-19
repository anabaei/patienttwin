"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/ui/shadcn-io/theme-switcher";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@twinn/store";
import {
  Bell,
  Download,
  Eye,
  Globe,
  Mail,
  MessageCircle,
  Palette,
  Shield,
  Smartphone,
  Trash2,
  User
} from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { 
    chatSupport, 
    notifications, 
    privacy, 
    appearance, 
    setChatSupport, 
    setNotification, 
    setPrivacy, 
    setAppearance 
  } = useSettingsStore();

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotification(key as keyof typeof notifications, value);
  };

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacy(key as keyof typeof privacy, value);
  };

  const handleAppearanceChange = (key: string, value: boolean) => {
    setAppearance(key as keyof typeof appearance, value);
  };

  const exportData = () => {
    // In a real app, this would export user data
    console.log("Exporting user data...");
  };

  const deleteAccount = () => {
    // In a real app, this would show a confirmation dialog
    console.log("Delete account requested...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and app settings
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize how the app looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="text-base font-medium">
                Theme
              </Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred color scheme
              </p>
            </div>
            <ThemeSwitcher 
              value={theme as 'light' | 'dark' | 'system'}
              onChange={setTheme}
            />
          </div>

          <Separator />

          {/* Compact Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-mode" className="text-base font-medium">
                Compact Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Reduce spacing and padding for a more compact interface
              </p>
            </div>
            <Switch
              id="compact-mode"
              checked={appearance.compactMode}
              onCheckedChange={(checked) => handleAppearanceChange('compactMode', checked)}
            />
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="large-text" className="text-base font-medium">
                Large Text
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase text size for better readability
              </p>
            </div>
            <Switch
              id="large-text"
              checked={appearance.largeText}
              onCheckedChange={(checked) => handleAppearanceChange('largeText', checked)}
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast" className="text-base font-medium">
                High Contrast
              </Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better accessibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={appearance.highContrast}
              onCheckedChange={(checked) => handleAppearanceChange('highContrast', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>

          <Separator />

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-base font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get instant notifications on your device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={(checked) => handleNotificationChange('push', checked)}
            />
          </div>

          <Separator />

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms-notifications" className="text-base font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                SMS Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive text message alerts
              </p>
            </div>
            <Switch
              id="sms-notifications"
              checked={notifications.sms}
              onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
            />
          </div>

          <Separator />

          {/* Appointment Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointment-reminders" className="text-base font-medium">
                Appointment Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get reminded about upcoming appointments
              </p>
            </div>
            <Switch
              id="appointment-reminders"
              checked={notifications.appointmentReminders}
              onCheckedChange={(checked) => handleNotificationChange('appointmentReminders', checked)}
            />
          </div>

          <Separator />

          {/* Insurance Updates */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="insurance-updates" className="text-base font-medium">
                Insurance Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Notifications about insurance changes and coverage
              </p>
            </div>
            <Switch
              id="insurance-updates"
              checked={notifications.insuranceUpdates}
              onCheckedChange={(checked) => handleNotificationChange('insuranceUpdates', checked)}
            />
          </div>

          <Separator />

          {/* Marketing */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing" className="text-base font-medium">
                Marketing Communications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive promotional offers and health tips
              </p>
            </div>
            <Switch
              id="marketing"
              checked={notifications.marketing}
              onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
            />
          </div>

          <Separator />

          {/* Chat Support */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="chat-support" className="text-base font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Chat Support
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable the floating chat support button
              </p>
            </div>
            <Switch
              id="chat-support"
              checked={chatSupport}
              onCheckedChange={setChatSupport}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Manage your privacy settings and data preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visibility" className="text-base font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Profile Visibility
              </Label>
              <p className="text-sm text-muted-foreground">
                Control who can see your profile information
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {privacy.profileVisibility}
            </Badge>
          </div>

          <Separator />

          {/* Data Sharing */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-sharing" className="text-base font-medium">
                Data Sharing
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow sharing of anonymized data for research
              </p>
            </div>
            <Switch
              id="data-sharing"
              checked={privacy.dataSharing}
              onCheckedChange={(checked) => handlePrivacyChange('dataSharing', checked)}
            />
          </div>

          <Separator />

          {/* Analytics */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="analytics" className="text-base font-medium">
                Usage Analytics
              </Label>
              <p className="text-sm text-muted-foreground">
                Help improve the app by sharing usage data
              </p>
            </div>
            <Switch
              id="analytics"
              checked={privacy.analytics}
              onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
            />
          </div>

          <Separator />

          {/* Location Tracking */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="location-tracking" className="text-base font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Location Tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow location tracking for nearby clinic suggestions
              </p>
            </div>
            <Switch
              id="location-tracking"
              checked={privacy.locationTracking}
              onCheckedChange={(checked) => handlePrivacyChange('locationTracking', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Management
          </CardTitle>
          <CardDescription>
            Manage your account data and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Data */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Label>
              <p className="text-sm text-muted-foreground">
                Download a copy of your personal data
              </p>
            </div>
            <Button variant="outline" onClick={exportData}>
              Export
            </Button>
          </div>

          <Separator />

          {/* Delete Account */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-medium flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Label>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" onClick={deleteAccount}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
