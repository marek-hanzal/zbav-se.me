import { createMiddleware } from "@tanstack/react-start";

export const withUserMiddleware = createMiddleware().server(async ({ next }) => {
	return next({
		context: {
			user: {
				id: "123",
			} as const,
		},
	});
});
