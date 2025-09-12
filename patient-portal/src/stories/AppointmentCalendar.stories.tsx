import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { AppointmentCalendar } from '../components/ui/appointment-calendar';

const meta: Meta<typeof AppointmentCalendar> = {
  title: 'Components/AppointmentCalendar',
  component: AppointmentCalendar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock availability data
const mockAvailability = {
  '2024-01-20': [
    { time: '08:00', available: false, reason: 'Outside hours' },
    { time: '08:30', available: false, reason: 'Outside hours' },
    { time: '09:00', available: true },
    { time: '09:30', available: false, reason: 'Booked' },
    { time: '10:00', available: false, reason: 'Booked' },
    { time: '10:30', available: true },
    { time: '11:00', available: false, reason: 'Booked' },
    { time: '11:30', available: true },
    { time: '12:00', available: false, reason: 'Lunch break' },
    { time: '12:30', available: false, reason: 'Lunch break' },
    { time: '13:00', available: false, reason: 'Booked' },
    { time: '13:30', available: true },
    { time: '14:00', available: true },
    { time: '14:30', available: false, reason: 'Booked' },
    { time: '15:00', available: true },
    { time: '15:30', available: true },
    { time: '16:00', available: false, reason: 'Booked' },
    { time: '16:30', available: false, reason: 'Booked' },
    { time: '17:00', available: false, reason: 'Outside hours' },
    { time: '17:30', available: false, reason: 'Outside hours' },
  ],
  '2024-01-21': [
    { time: '08:00', available: false, reason: 'Outside hours' },
    { time: '08:30', available: false, reason: 'Outside hours' },
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false, reason: 'Booked' },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: false, reason: 'Booked' },
    { time: '12:00', available: false, reason: 'Lunch break' },
    { time: '12:30', available: false, reason: 'Lunch break' },
    { time: '13:00', available: true },
    { time: '13:30', available: false, reason: 'Booked' },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: false, reason: 'Booked' },
    { time: '15:30', available: true },
    { time: '16:00', available: true },
    { time: '16:30', available: false, reason: 'Booked' },
    { time: '17:00', available: false, reason: 'Outside hours' },
    { time: '17:30', available: false, reason: 'Outside hours' },
  ],
  '2024-01-22': [
    { time: '08:00', available: false, reason: 'Outside hours' },
    { time: '08:30', available: true },
    { time: '09:00', available: false, reason: 'Booked' },
    { time: '09:30', available: true },
    { time: '10:00', available: true },
    { time: '10:30', available: false, reason: 'Booked' },
    { time: '11:00', available: true },
    { time: '11:30', available: false, reason: 'Booked' },
    { time: '12:00', available: false, reason: 'Lunch break' },
    { time: '12:30', available: false, reason: 'Lunch break' },
    { time: '13:00', available: false, reason: 'Booked' },
    { time: '13:30', available: true },
    { time: '14:00', available: false, reason: 'Booked' },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: false, reason: 'Booked' },
    { time: '16:00', available: true },
    { time: '16:30', available: false, reason: 'Booked' },
    { time: '17:00', available: false, reason: 'Outside hours' },
    { time: '17:30', available: false, reason: 'Outside hours' },
  ],
};

function AppointmentCalendarWrapper() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  return (
    <AppointmentCalendar
      availability={mockAvailability}
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      selectedTime={selectedTime}
      onTimeSelect={setSelectedTime}
      specialistName="Dr. Amelia Chen"
      isLoading={false}
    />
  );
}

export const Default: Story = {
  render: () => <AppointmentCalendarWrapper />,
};

export const WithPreSelectedDate: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date('2024-01-20'));
    const [selectedTime, setSelectedTime] = useState<string | undefined>();

    return (
      <AppointmentCalendar
        availability={mockAvailability}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        specialistName="Dr. Michael Rodriguez"
        isLoading={false}
      />
    );
  },
};

export const WithPreSelectedDateTime: Story = {
  render: () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date('2024-01-21'));
    const [selectedTime, setSelectedTime] = useState<string | undefined>('09:00');

    return (
      <AppointmentCalendar
        availability={mockAvailability}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        selectedTime={selectedTime}
        onTimeSelect={setSelectedTime}
        specialistName="Dr. Sarah Johnson"
        isLoading={false}
      />
    );
  },
};

export const LoadingState: Story = {
  render: () => (
    <AppointmentCalendar
      availability={{}}
      selectedDate={undefined}
      onDateSelect={() => {}}
      selectedTime={undefined}
      onTimeSelect={() => {}}
      specialistName="Dr. Loading..."
      isLoading={true}
    />
  ),
};

export const NoAvailability: Story = {
  render: () => (
    <AppointmentCalendar
      availability={{}}
      selectedDate={undefined}
      onDateSelect={() => {}}
      selectedTime={undefined}
      onTimeSelect={() => {}}
      specialistName="Dr. Unavailable"
      isLoading={false}
    />
  ),
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <AppointmentCalendarWrapper />,
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <AppointmentCalendarWrapper />,
};

export const Interactive: Story = {
  render: () => <AppointmentCalendarWrapper />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Test calendar toggle
    const calendarButton = canvas.getByText('Select a date');
    await userEvent.click(calendarButton);
    
    // Test date selection
    const dateButton = canvas.getByText('20');
    await userEvent.click(dateButton);
    
    // Test time selection
    const timeSlot = canvas.getByText('09:00');
    await userEvent.click(timeSlot);
    
    // Verify selection
    await expect(canvas.getByText('Selected Time')).toBeInTheDocument();
  },
};
