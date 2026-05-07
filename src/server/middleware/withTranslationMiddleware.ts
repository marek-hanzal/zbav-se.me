import { createMiddleware } from "@tanstack/react-start";
import { translator } from "@/lib/common/translation";
import { defaultLocale } from "~/locales";
import { withLocaleMiddleware } from "~/server/middleware/withLocaleMiddleware";

export const withTranslationMiddleware = createMiddleware()
	.middleware([
		withLocaleMiddleware,
	])
	.server(async ({ next, context: { locale } }) => {
		try {
			translator.push((await import(`../../translation/${locale}.yaml`)).default);
		} catch {
			translator.push((await import(`../../translation/${defaultLocale}.yaml`)).default);
		}

		return next();
	});
