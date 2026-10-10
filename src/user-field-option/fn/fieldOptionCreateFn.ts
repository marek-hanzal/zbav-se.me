import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { fieldOptionCreateFx } from "~/user-field-option/fx/fieldOptionCreateFx";
import { FieldOptionCreateSchema } from "~/user-field-option/schema/FieldOptionCreateSchema";
import { FieldOptionSchema } from "~/user-field-option/schema/FieldOptionSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace fieldOptionCreateFn {
	export type Error = Effect.Error<fieldOptionCreateFx>;
}

export const fieldOptionCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(FieldOptionCreateSchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: FieldOptionSchema,
			dataFx: fieldOptionCreateFx(data),
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
