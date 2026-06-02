import { createMiddleware } from "@tanstack/react-start";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";

export const withOriginMiddleware = createMiddleware().server(async ({ next }) => {
	const { VITE_ORIGIN } = ViteEnvSchema.parse(process.env);

	return next({
		context: {
			origin: VITE_ORIGIN,
		},
	});
});
