import { createFileRoute } from "@tanstack/react-router";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";

export const Route = createFileRoute("/api")({
	server: {
		middleware: [
			withLogMiddleware,
			withDatabaseMiddleware,
		],
	},
});
