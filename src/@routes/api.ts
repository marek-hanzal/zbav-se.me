import { createFileRoute } from "@tanstack/react-router";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";

export const Route = createFileRoute("/api")({
	server: {
		middleware: [
			withDatabaseMiddleware,
		],
	},
});
