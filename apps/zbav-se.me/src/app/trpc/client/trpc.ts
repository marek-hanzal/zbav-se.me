import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { ApiRouter } from "~/app/trpc/server/apiRouter";

export const client = createTRPCProxyClient<ApiRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
			transformer: superjson,
		}),
	],
});
