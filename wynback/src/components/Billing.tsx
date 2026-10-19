"use client";

import { createContext, useContext, useState } from "react";
import { ANNUAL_DISCOUNT } from "@/content";

type Billing = "monthly" | "annual";
const BillingContext = createContext<{ billing: Billing; setBilling: (b: Billing) => void }>({
  billing: "monthly",
  setBilling: () => {},
});

// Pricing and the ROI calculator share the monthly / annual choice.
export function BillingProvider({ children }: { children: React.ReactNode }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  return <BillingContext.Provider value={{ billing, setBilling }}>{children}</BillingContext.Provider>;
}

export const useBilling = () => useContext(BillingContext);

export function monthlyPrice(monthly: number, billing: Billing) {
  return billing === "annual" ? Math.round(monthly * (1 - ANNUAL_DISCOUNT) * 100) / 100 : monthly;
}

export function formatGBP(n: number, decimals = 0) {
  const fixed = Number.isInteger(n) ? 0 : decimals || 2;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  }).format(n);
}
