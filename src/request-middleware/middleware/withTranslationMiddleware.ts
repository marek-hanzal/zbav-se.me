import { createMiddleware } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLocaleMiddleware } from "~/request-middleware/middleware/withLocaleMiddleware";
import { withTranslatorFx } from "~/translator/fx/withTranslatorFx";

export const withTranslationMiddleware = createMiddleware()
	.middleware([
		withLocaleMiddleware,
		withDatabaseMiddleware,
	])
	.server(async ({ next: nextFn, context: { database, locale } }) => {
		const translator = await withTranslatorFx({
			locale,
		}).pipe(withKyselyFn(database), Effect.runPromise);

		return nextFn({
			context: {
				translator,
			},
		});
	});
