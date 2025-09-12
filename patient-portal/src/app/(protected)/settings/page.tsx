"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your app preferences
        </p>
      </div>

      {/* Settings Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            App Preferences
          </CardTitle>
          <CardDescription>
            Customize your experience and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Settings panel coming soon...</p>
            <p className="text-sm">This will include theme preferences, privacy settings, and app configuration.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
