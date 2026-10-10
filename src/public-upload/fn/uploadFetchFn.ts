import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { uploadFetchFx } from "~/public-upload/fx/uploadFetchFx";
import { UploadQuerySchema } from "~/public-upload/schema/UploadQuerySchema";
import { UploadSchema } from "~/public-upload/schema/UploadSchema";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace uploadFetchFn {
	export type Error = Effect.Error<uploadFetchFx>;
}

export const uploadFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(UploadQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: UploadSchema,
			dataFx: uploadFetchFx({
				...data,
				scope: {},
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
