import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { fieldOptionCreateFx } from "~/user/field-option/server/fx/fieldOptionCreateFx";
import { FieldOptionCreateSchema } from "~/user/field-option/server/schema/FieldOptionCreateSchema";
import { FieldOptionSchema } from "~/user/field-option/server/schema/FieldOptionSchema";

export namespace fieldOptionCreateFn {
	export type Error = Effect.Effect.Error<fieldOptionCreateFx>;
}

export const fieldOptionCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(FieldOptionCreateSchema)
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
