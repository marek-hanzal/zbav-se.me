import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { fieldCountFx } from "~/user-field/fx/fieldCountFx";
import { FieldCountQuerySchema } from "~/user-field/schema/FieldCountQuerySchema";

export namespace fieldCountFn {
	export type Error = Effect.Error<fieldCountFx>;
}

export const fieldCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(FieldCountQuerySchema)
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
		}).pipe(withKyselyFn(database), withLoggerFn(rootLogger), Effect.runPromise);
	});
