"use client";

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useState } from "react";
import { trpc } from "@/utils/trpc";
import { signOut } from "next-auth/react";
import type { AppRouter } from "@/server/routers/_app";
import type { TRPCClientErrorLike } from "@trpc/client";

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (err) => {
        const error = err as unknown as TRPCClientErrorLike<AppRouter>;
        if (error?.data?.code === "UNAUTHORIZED" || error?.shape?.message?.includes("expired")) {
          signOut({ callbackUrl: "/admin/login" });
        }
      }
    }),
    mutationCache: new MutationCache({
      onError: (err) => {
        const error = err as unknown as TRPCClientErrorLike<AppRouter>;
        if (error?.data?.code === "UNAUTHORIZED" || error?.shape?.message?.includes("expired")) {
          signOut({ callbackUrl: "/admin/login" });
        }
      }
    }),
    defaultOptions: {
      queries: {
        retry: false,
      },
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
