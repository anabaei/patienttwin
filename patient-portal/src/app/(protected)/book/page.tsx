"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

export default function BookPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Book Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your next appointment
        </p>
      </div>

      {/* Booking Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Booking
          </CardTitle>
          <CardDescription>
            Select a clinic, specialist, and available time slot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Appointment booking wizard coming soon...</p>
            <p className="text-sm">This will include clinic selection, specialist choice, and time slot booking.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
