import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = async (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => ({
      session: await getServerSession(authOptions),
    }),
  });

export { handler as GET, handler as POST };
