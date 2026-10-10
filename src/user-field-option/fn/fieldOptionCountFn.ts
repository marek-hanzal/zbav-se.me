import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { fieldOptionCountFx } from "~/user-field-option/fx/fieldOptionCountFx";
import { FieldOptionCountQuerySchema } from "~/user-field-option/schema/FieldOptionCountQuerySchema";

export namespace fieldOptionCountFn {
	export type Error = Effect.Error<fieldOptionCountFx>;
}

export const fieldOptionCountFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(FieldOptionCountQuerySchema)
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
