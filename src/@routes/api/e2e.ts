import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/e2e")({
	server: {
		handlers: {
			async GET({ context: { databaseKey } }) {
				return new Response(
					JSON.stringify({
						databaseKey,
					}),
					{
						headers: {
							"content-type": "application/json",
						},
					},
				);
			},
		},
	},
});
