import { createFileRoute } from "@tanstack/react-router";
import { auth } from "~/authentication/fn/auth";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withTranslationMiddleware } from "~/request-middleware/middleware/withTranslationMiddleware";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		middleware: [
			withLogMiddleware,
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
