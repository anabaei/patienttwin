"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <p className="text-muted-foreground">
          Manage your upcoming and past appointments
        </p>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment History
          </CardTitle>
          <CardDescription>
            View, reschedule, or cancel your appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Appointment management coming soon...</p>
            <p className="text-sm">This will include appointment history, rescheduling, and cancellation features.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
