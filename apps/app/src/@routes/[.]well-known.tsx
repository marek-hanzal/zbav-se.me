import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/.well-known")({
	server: {
		handlers: {
			async GET() {
				return Response.json({
					message: "Hello there!",
				});
			},
		},
	},
});
