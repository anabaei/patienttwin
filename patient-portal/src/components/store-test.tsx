
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointmentsStore, useAuthStore, useAvailabilityStore, useDirectoryStore, useInsuranceStore } from "@twinn/store";

export function StoreTest() {
  const { account, signIn, signOut, isLoading, error } = useAuthStore();
  const { providers, connectedPlan, connectInsurance, getBenefitsForServiceOption } = useInsuranceStore();
  const { clinics, searchClinics, getSpecialistsForClinic } = useDirectoryStore();
  const { generateSlots, slots, getSlotsForSpecialist } = useAvailabilityStore();
  const { bookAppointment, appointments, getUpcomingAppointments } = useAppointmentsStore();

  const handleSignIn = () => {
    signIn("test@example.com", "1234");
  };

  const handleConnectInsurance = () => {
    connectInsurance({
      providerId: "provider-001",
      planId: "plan-001",
      memberId: "MEMBER123",
      dob: "1990-01-15",
    });
  };

  const handleSearchClinics = () => {
    const results = searchClinics({
      zip: "M5G 2C4",
      radiusMiles: 10,
    });
    console.log("Search results:", results);
  };

  const handleGenerateSlots = () => {
    generateSlots({
      clinicId: "clinic-001",
      specialistId: "user-001",
      serviceOptionId: "service-opt-001",
      from: new Date().toISOString(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    });
  };

  const handleBookAppointment = () => {
    bookAppointment({
      clinicId: "clinic-001",
      specialistId: "user-001",
      serviceId: "service-001",
      serviceOptionId: "service-opt-001",
      slotId: "slot-001",
    });
  };

  const handleGetCoverage = () => {
    const coverage = getBenefitsForServiceOption("service-opt-001");
    console.log("Coverage details:", coverage);
  };

  const upcomingAppointments = getUpcomingAppointments("patient-001");
  const availableSlots = getSlotsForSpecialist("user-001", "clinic-001", "service-opt-001");

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Store Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auth Store Test */}
          <div>
            <h3 className="font-semibold">Auth Store</h3>
            <p>Account: {account ? `${account.firstName} ${account.lastName}` : "Not signed in"}</p>
            <p>Loading: {isLoading ? "Yes" : "No"}</p>
            <p>Error: {error || "None"}</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={handleSignIn} disabled={isLoading}>
                Sign In (Mock)
              </Button>
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>

          {/* Insurance Store Test */}
          <div>
            <h3 className="font-semibold">Insurance Store</h3>
            <p>Providers: {providers.length}</p>
            <p>Connected Plan: {connectedPlan ? "Yes" : "No"}</p>
            <Button onClick={handleConnectInsurance} className="mt-2">
              Connect Insurance (Mock)
            </Button>
          </div>

          {/* Directory Store Test */}
          <div>
            <h3 className="font-semibold">Directory Store</h3>
            <p>Clinics: {clinics.length}</p>
            <Button onClick={handleSearchClinics} className="mt-2">
              Search Clinics (Mock)
            </Button>
          </div>

          {/* Availability Store Test */}
          <div>
            <h3 className="font-semibold">Availability Store</h3>
            <p>Total Slots: {slots.length}</p>
            <p>Available Slots: {availableSlots.length}</p>
            <Button onClick={handleGenerateSlots} className="mt-2">
              Generate Slots (Mock)
            </Button>
          </div>

          {/* Appointments Store Test */}
          <div>
            <h3 className="font-semibold">Appointments Store</h3>
            <p>Total Appointments: {appointments.length}</p>
            <p>Upcoming Appointments: {upcomingAppointments.length}</p>
            <div className="flex gap-2 mt-2">
              <Button onClick={handleBookAppointment} className="mt-2">
                Book Appointment (Mock)
              </Button>
              <Button onClick={handleGetCoverage} variant="outline" className="mt-2">
                Get Coverage (Mock)
              </Button>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant={account ? "default" : "secondary"}>
              {account ? "Signed In" : "Not Signed In"}
            </Badge>
            <Badge variant={connectedPlan ? "default" : "secondary"}>
              {connectedPlan ? "Insurance Connected" : "No Insurance"}
            </Badge>
            <Badge variant={slots.length > 0 ? "default" : "secondary"}>
              {slots.length > 0 ? "Slots Available" : "No Slots"}
            </Badge>
            <Badge variant={appointments.length > 0 ? "default" : "secondary"}>
              {appointments.length > 0 ? "Has Appointments" : "No Appointments"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
