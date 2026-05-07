import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { fieldCreateFx } from "~/user/field/server/fx/fieldCreateFx";
import { FieldCreateSchema } from "~/user/field/server/schema/FieldCreateSchema";
import { FieldSchema } from "~/user/field/server/schema/FieldSchema";

export namespace fieldCreateFn {
	export type Error = Effect.Effect.Error<fieldCreateFx>;
}

export const fieldCreateFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(FieldCreateSchema)
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
