import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/migration/run")({
	server: {
		handlers: {
			async POST({ context: { database } }) {
				return Response.json(await database.migrate());
			},
		},
	},
});
