import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { fieldFetchFx } from "~/user-field/fx/fieldFetchFx";
import { FieldQuerySchema } from "~/user-field/schema/FieldQuerySchema";
import { FieldSchema } from "~/user-field/schema/FieldSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace fieldFetchFn {
	export type Error = Effect.Error<fieldFetchFx>;
}

export const fieldFetchFn = createServerFn()
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
			schema: FieldSchema,
			dataFx: fieldFetchFx({
				...data,
				scope: {
					// fields are global, no user scope needed typically
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
