import { createFileRoute } from "@tanstack/react-router";
import { auth } from "~/server/auth/auth";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		handlers: {
			async GET({ request, context: { database } }) {
				return auth(() => database.dialect).handler(request);
			},
			async POST({ request, context: { database } }) {
				return auth(() => database.dialect).handler(request);
			},
		},
	},
});
