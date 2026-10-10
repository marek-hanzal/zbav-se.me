import { createFileRoute } from "@tanstack/react-router";
import { authFn } from "~/authentication/fn/authFn";
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
				return authFn({
					dialectFn: () => database.dialect,
					translator,
				}).handler(request);
			},
			async POST({ request, context: { database, translator } }) {
				return authFn({
					dialectFn: () => database.dialect,
					translator,
				}).handler(request);
			},
		},
	},
});
