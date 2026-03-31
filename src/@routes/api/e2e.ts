import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/e2e")({
	server: {
		handlers: {
			async GET({ request }) {
				return Response.json({
					db: request.headers.get("x-e2e-db"),
				});
			},
		},
	},
});
