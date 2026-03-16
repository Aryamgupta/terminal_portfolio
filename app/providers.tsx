"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { TRPCProvider } from "@/components/providers/TRPCProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <SessionProvider>{children}</SessionProvider>
    </TRPCProvider>
  );
}
