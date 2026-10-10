import { createMiddleware } from "@tanstack/react-start";
import { getLocaleFn } from "~/locale/fn/getLocaleFn";

export const withLocaleMiddleware = createMiddleware().server(async ({ next: nextFn }) => {
	return nextFn({
		context: {
			locale: await getLocaleFn(),
		},
	});
});
