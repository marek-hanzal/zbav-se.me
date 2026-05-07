import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { fieldOptionFetchFx } from "~/user/field-option/server/fx/fieldOptionFetchFx";
import { FieldOptionQuerySchema } from "~/user/field-option/server/schema/FieldOptionQuerySchema";
import { FieldOptionSchema } from "~/user/field-option/server/schema/FieldOptionSchema";

export namespace fieldOptionFetchFn {
	export type Error = Effect.Effect.Error<fieldOptionFetchFx>;
}

export const fieldOptionFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(FieldOptionQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: FieldOptionSchema,
			dataFx: fieldOptionFetchFx({
				...data,
				scope: {
					// options may be filtered by fieldId
				},
			}),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(rootLogger),
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
