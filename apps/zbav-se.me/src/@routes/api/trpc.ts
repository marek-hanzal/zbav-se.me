import { createServerFileRoute } from "@tanstack/react-start/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { apiRouter } from "~/app/trpc/server/apiRouter";
import { createContext } from "~/app/trpc/server/trpc";

export const ServerRoute = createServerFileRoute("/api/trpc").methods({
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
});
