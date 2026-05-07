import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { fieldOptionCollectionFx } from "~/user/field-option/server/fx/fieldOptionCollectionFx";
import { FieldOptionQuerySchema } from "~/user/field-option/server/schema/FieldOptionQuerySchema";
import { FieldOptionSchema } from "../server/schema/FieldOptionSchema";

export namespace fieldOptionCollectionFn {
	export type Error = Effect.Effect.Error<fieldOptionCollectionFx>;
}

export const fieldOptionCollectionFn = createServerFn()
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
			schema: z.array(FieldOptionSchema),
			dataFx: fieldOptionCollectionFx({
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
