import { createMiddleware } from "@tanstack/react-start";

export const withDevEnvMiddleware = createMiddleware().server(async ({ next }) => {
	const isProd = process.env.NODE_ENV === "production";
	const isDev = !isProd;

	return next({
		context: {
			isDev,
			isProd,
		},
	});
});
