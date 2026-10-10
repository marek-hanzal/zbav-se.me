import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLocaleMiddleware } from "~/request-middleware/middleware/withLocaleMiddleware";
import { withTranslatorFx } from "~/translator/fx/withTranslatorFx";

export const withTranslationMiddleware = createMiddleware()
	.middleware([
		withLocaleMiddleware,
		withDatabaseMiddleware,
	])
	.server(async ({ next, context: { database, locale } }) => {
		const translator = await withTranslatorFx({
			locale,
		}).pipe(withKyselyFx(database), Effect.runPromise);

		return next({
			context: {
				translator,
			},
		});
	});
