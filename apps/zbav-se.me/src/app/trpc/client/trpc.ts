import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { ApiRouter } from "~/app/trpc/server/apiRouter";

export const trpc = createTRPCReact<ApiRouter>();

export const client = createTRPCProxyClient<ApiRouter>({
	links: [
		httpBatchLink({
			url: "/api/trpc",
			transformer: superjson,
		}),
	],
});
