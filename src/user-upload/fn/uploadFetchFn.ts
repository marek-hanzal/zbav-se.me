import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { uploadFetchFx } from "~/user-upload/fx/uploadFetchFx";
import { UploadQuerySchema } from "~/user-upload/schema/UploadQuerySchema";
import { UploadSchema } from "~/user-upload/schema/UploadSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace uploadFetchFn {
	export type Error = Effect.Error<uploadFetchFx>;
}

export const uploadFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(UploadQuerySchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: UploadSchema,
			dataFx: uploadFetchFx({
				...data,
				scope: {
					userId: user.id,
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
