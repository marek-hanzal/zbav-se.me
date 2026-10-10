import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { fieldCreateFx } from "~/user-field/fx/fieldCreateFx";
import { FieldCreateSchema } from "~/user-field/schema/FieldCreateSchema";
import { FieldSchema } from "~/user-field/schema/FieldSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace fieldCreateFn {
	export type Error = Effect.Error<fieldCreateFx>;
}

export const fieldCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(FieldCreateSchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: FieldSchema,
			dataFx: fieldCreateFx(data),
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
