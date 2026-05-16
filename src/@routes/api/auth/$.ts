import { createFileRoute } from "@tanstack/react-router";
import { auth } from "~/server/auth/auth";
import { withLocaleMiddleware } from "~/server/middleware/withLocaleMiddleware";

export const Route = createFileRoute("/api/auth/$")({
	server: {
		middleware: [
			withLocaleMiddleware,
		],
		handlers: {
			async GET({ request, context: { database, locale } }) {
				return auth({
					dialect: () => database.dialect,
					locale,
				}).handler(request);
			},
			async POST({ request, context: { database, locale } }) {
				return auth({
					dialect: () => database.dialect,
					locale,
				}).handler(request);
			},
		},
	},
});
