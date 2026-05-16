import { Effect } from "effect";
import { createMiddleware } from "@tanstack/react-start";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withTranslatorFx } from "~/translator/server/fx/withTranslatorFx";
import { withLocaleMiddleware } from "./withLocaleMiddleware";

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
