import { createFileRoute } from "@tanstack/react-router";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";

export const Route = createFileRoute("/api")({
	server: {
		middleware: [
			withDatabaseMiddleware,
		],
	},
});
