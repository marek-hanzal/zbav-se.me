import { createFileRoute } from "@tanstack/react-router";
import { sql } from "kysely";

export const Route = createFileRoute("/api/health")({
	server: {
		handlers: {
			async GET({
				context: {
					database: { kysely },
				},
			}) {
				try {
					/**
					 * Ensure DB connection is running
					 */
					await sql`select 1`.execute(kysely);

					/**
					 * A bit more complex logic may be here
					 */
					return Response.json(true);
				} catch {
					return Response.json(false, {
						status: 500,
					});
				}
			},
		},
	},
});
