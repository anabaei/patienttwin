"use client";

import { RequireAuth } from "@/components/auth/require-auth";
import { InsuranceConnectionPage } from "@/components/insurance/insurance-connection-page";

export default function InsurancePage() {
  return (
    <RequireAuth>
      <InsuranceConnectionPage />
    </RequireAuth>
  );
}
