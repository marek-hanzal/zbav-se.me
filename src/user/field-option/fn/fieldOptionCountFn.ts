import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { fieldOptionCountFx } from "~/user/field-option/server/fx/fieldOptionCountFx";
import { FieldOptionCountQuerySchema } from "~/user/field-option/server/schema/FieldOptionCountQuerySchema";

export namespace fieldOptionCountFn {
	export type Error = Effect.Effect.Error<fieldOptionCountFx>;
}

export const fieldOptionCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(FieldOptionCountQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return fieldOptionCountFx({
			...data,
			scope: {
				// options scoped to field
			},
		}).pipe(withKyselyFx(database), withLoggerFx(rootLogger), Effect.runPromise);
	});
