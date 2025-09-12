'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isPast, isToday, isTomorrow, startOfDay } from 'date-fns';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar as CalendarIcon,
    CheckCircle,
    ChevronRight,
    Clock,
    XCircle,
} from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

interface AvailabilityData {
  [date: string]: TimeSlot[];
}

interface AppointmentCalendarProps {
  availability: AvailabilityData;
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  specialistName: string;
  isLoading?: boolean;
}


// Get next available date
function getNextAvailableDate(availability: AvailabilityData): Date | null {
  const today = startOfDay(new Date());
  const dates = Object.keys(availability)
    .map(date => new Date(date))
    .filter(date => date >= today)
    .sort((a, b) => a.getTime() - b.getTime());

  for (const date of dates) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const slots = availability[dateStr];
    if (slots && slots.some(slot => slot.available)) {
      return date;
    }
  }
  return null;
}

// Get next available time for a specific date
function getNextAvailableTime(availability: AvailabilityData, date: Date): string | null {
  const dateStr = format(date, 'yyyy-MM-dd');
  const slots = availability[dateStr];
  if (slots) {
    const availableSlot = slots.find(slot => slot.available);
    return availableSlot ? availableSlot.time : null;
  }
  return null;
}

export function AppointmentCalendar({
  availability,
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  specialistName,
  isLoading = false,
}: AppointmentCalendarProps) {
  const nextAvailableDate = getNextAvailableDate(availability);
  const nextAvailableTime = nextAvailableDate ? getNextAvailableTime(availability, nextAvailableDate) : null;

  // Get available dates for calendar
  const availableDates = Object.keys(availability)
    .map(date => new Date(date))
    .filter(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const slots = availability[dateStr];
      return slots && slots.some(slot => slot.available);
    });

  // Get time slots for selected date
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const timeSlots = selectedDateStr ? availability[selectedDateStr] || [] : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Next Available Section */}
      {nextAvailableDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Next Available</h3>
                    <p className="text-sm text-muted-foreground">
                      {isToday(nextAvailableDate) && 'Today'}
                      {isTomorrow(nextAvailableDate) && 'Tomorrow'}
                      {!isToday(nextAvailableDate) && !isTomorrow(nextAvailableDate) && 
                        format(nextAvailableDate, 'EEEE, MMMM d')}
                      {nextAvailableTime && ` at ${nextAvailableTime}`}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    onDateSelect(nextAvailableDate);
                    if (nextAvailableTime) {
                      onTimeSelect(nextAvailableTime);
                    }
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Book Now
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card className="border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
              Select Date
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose an available date for your appointment
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="w-full overflow-hidden">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    onDateSelect(date);
                  }
                }}
                disabled={(date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return (
                    isPast(date) ||
                    !availability[dateStr] ||
                    !availability[dateStr].some(slot => slot.available)
                  );
                }}
                modifiers={{
                  available: availableDates,
                }}
              
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="border border-border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Select Time
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedDate ? (
                `Available times for ${format(selectedDate, 'EEEE, MMMM d')}`
              ) : (
                'Please select a date first'
              )}
            </p>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot, index) => (
                      <motion.button
                        key={`${slot.time}-${index}`}
                        className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                          slot.available
                            ? selectedTime === slot.time
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50 hover:bg-primary/5'
                            : 'border-muted bg-muted/50 text-muted-foreground cursor-not-allowed'
                        }`}
                        onClick={() => slot.available && onTimeSelect(slot.time)}
                        disabled={!slot.available}
                        whileHover={slot.available ? { scale: 1.05 } : {}}
                        whileTap={slot.available ? { scale: 0.95 } : {}}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center justify-center">
                          {slot.available ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          {slot.time}
                        </div>
                        {!slot.available && slot.reason && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {slot.reason}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No available time slots for this date</p>
                    <p className="text-xs">Please select a different date</p>
                  </div>
                )}

                {/* Selected Time Summary */}
                {selectedTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-primary/5 border border-primary/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Selected Time</p>
                        <p className="text-sm text-muted-foreground">
                          {format(selectedDate, 'EEEE, MMMM d')} at {selectedTime}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Please select a date first</p>
                <p className="text-xs">Available time slots will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
