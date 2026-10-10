import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { fieldOptionCollectionFx } from "~/user-field-option/fx/fieldOptionCollectionFx";
import { FieldOptionQuerySchema } from "~/user-field-option/schema/FieldOptionQuerySchema";
import { FieldOptionSchema } from "~/user-field-option/schema/FieldOptionSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace fieldOptionCollectionFn {
	export type Error = Effect.Error<fieldOptionCollectionFx>;
}

export const fieldOptionCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(FieldOptionQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(FieldOptionSchema),
			dataFx: fieldOptionCollectionFx({
				...data,
				scope: {
					// options may be filtered by fieldId
				},
			}),
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
