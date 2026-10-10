import { createMiddleware } from "@tanstack/react-start";

export const withDevEnvMiddleware = createMiddleware().server(async ({ next: nextFn }) => {
	const isProd = process.env.NODE_ENV === "production";
	const isDev = !isProd;

	return nextFn({
		context: {
			isDev,
			isProd,
		},
	});
});
