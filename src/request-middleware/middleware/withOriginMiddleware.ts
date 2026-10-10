import { createMiddleware } from "@tanstack/react-start";
import { ViteEnvSchema } from "~/application-env/schema/ViteEnvSchema";

export const withOriginMiddleware = createMiddleware().server(async ({ next: nextFn }) => {
	const { VITE_ORIGIN } = ViteEnvSchema.parse(process.env);

	return nextFn({
		context: {
			origin: VITE_ORIGIN,
		},
	});
});
