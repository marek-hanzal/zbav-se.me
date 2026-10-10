import { createMiddleware } from "@tanstack/react-start";
import { getLocaleFn } from "~/locale/fn/getLocaleFn";

export const withLocaleMiddleware = createMiddleware().server(async ({ next }) => {
	return next({
		context: {
			locale: await getLocaleFn(),
		},
	});
});
