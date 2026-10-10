import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { translationsFx } from "~/translation/fx/translationsFx";
import { LocaleSchema } from "~/translation/schema/LocaleSchema";
import { TranslationSchema } from "~/translation/schema/TranslationSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace translationsFn {
	export type Error = Effect.Error<translationsFx>;
}

export const translationsFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(LocaleSchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(TranslationSchema),
			dataFx: translationsFx(data),
		}).pipe(
			withKyselyFn(database),
			withLoggerFn(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
