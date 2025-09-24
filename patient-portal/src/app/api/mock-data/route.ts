import { NextResponse } from "next/server";

import { mockPatientDataset } from "@twinn/store";

export async function GET() {
  return NextResponse.json({
    balances: mockPatientDataset.balances,
    directory: {
      clinics: mockPatientDataset.clinics,
      services: mockPatientDataset.services,
      serviceOptions: mockPatientDataset.serviceOptions,
      specialists: mockPatientDataset.specialists,
      availability: mockPatientDataset.availability,
      servicesByClinic: mockPatientDataset.servicesByClinic,
      serviceOptionsByService: mockPatientDataset.serviceOptionsByService,
    },
  });
}
