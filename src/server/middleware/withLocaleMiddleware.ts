import { createMiddleware } from "@tanstack/react-start";
import { getLocaleFn } from "~/common/locale/getLocaleFn";

export const withLocaleMiddleware = createMiddleware().server(async ({ next }) => {
	return next({
		context: {
			locale: await getLocaleFn(),
		},
	});
});
