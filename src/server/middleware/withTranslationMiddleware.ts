import { createMiddleware } from "@tanstack/react-start";
import { withTranslator } from "~/translator/server/withTranslator";
import { withLocaleMiddleware } from "./withLocaleMiddleware";

export const withTranslationMiddleware = createMiddleware()
	.middleware([
		withLocaleMiddleware,
	])
	.server(async ({ next, context: { locale } }) => {
		return next({
			context: {
				translator: await withTranslator(locale),
			},
		});
	});
