"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        onError: (error: any) => {
          if (error?.data?.code === "UNAUTHORIZED" || error?.shape?.message?.includes("expired")) {
            signOut({ callbackUrl: "/admin/login" });
          }
        }
      },
      mutations: {
        onError: (error: any) => {
          if (error?.data?.code === "UNAUTHORIZED" || error?.shape?.message?.includes("expired")) {
            signOut({ callbackUrl: "/admin/login" });
          }
        }
      }
    }
  }));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
