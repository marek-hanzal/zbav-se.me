import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { fieldCountFx } from "~/user/field/server/fx/fieldCountFx";
import { FieldCountQuerySchema } from "~/user/field/server/schema/FieldCountQuerySchema";

export namespace fieldCountFn {
	export type Error = Effect.Effect.Error<fieldCountFx>;
}

export const fieldCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(FieldCountQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return fieldCountFx({
			...data,
			scope: {
				// fields are global
			},
		}).pipe(withKyselyFx(database), withLoggerFx(rootLogger), Effect.runPromise);
	});
