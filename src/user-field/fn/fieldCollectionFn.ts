import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { fieldCollectionFx } from "~/user-field/fx/fieldCollectionFx";
import { FieldQuerySchema } from "~/user-field/schema/FieldQuerySchema";
import { FieldSchema } from "~/user-field/schema/FieldSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace fieldCollectionFn {
	export type Error = Effect.Error<fieldCollectionFx>;
}

export const fieldCollectionFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(FieldQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(FieldSchema),
			dataFx: fieldCollectionFx({
				...data,
				scope: {
					// fields are global
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
