import { createFileRoute } from "@tanstack/react-router";
import { auth } from "~/server/auth/auth";
import { withTranslationMiddleware } from "~/server/middleware/withTranslationMiddleware";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		middleware: [
			withTranslationMiddleware,
		],
		handlers: {
			async GET({ request, context: { database, translator } }) {
				return auth({
					dialect: () => database.dialect,
					translator,
				}).handler(request);
			},
			async POST({ request, context: { database, translator } }) {
				return auth({
					dialect: () => database.dialect,
					translator,
				}).handler(request);
			},
		},
	},
});
