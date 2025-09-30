import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { apiRouter } from "~/app/trpc/server/apiRouter";
import { createContext } from "~/app/trpc/server/trpc";

export const Route = createFileRoute("/api/trpc")({
	server: {
		handlers: {
			GET: ({ request }) =>
				fetchRequestHandler({
					endpoint: "/api/trpc",
					req: request,
					router: apiRouter,
					createContext,
				}),
			POST: ({ request }) =>
				fetchRequestHandler({
					endpoint: "/api/trpc",
					req: request,
					router: apiRouter,
					createContext,
				}),
		},
	},
});
