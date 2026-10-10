import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withS3ConfigEnvFn } from "~/s3/fn/withS3ConfigEnvFn";
import { withS3ConfigFn } from "~/s3/fn/withS3ConfigFn";
import { s3PreSignFx } from "~/s3/fx/s3PreSignFx";
import { S3PreSignRequestSchema } from "~/user-s3/schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "~/user-s3/schema/S3PreSignResponseSchema";
import { withUploadConfigEnvFn } from "~/user-upload/fn/withUploadConfigEnvFn";
import { withUploadConfigFn } from "~/user-upload/fn/withUploadConfigFn";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace s3PreSignFn {
	export type Error = Effect.Error<s3PreSignFx>;
}

export const s3PreSignFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(S3PreSignRequestSchema)
	.handler(async ({ data, context: { user, rootLogger, database }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: S3PreSignResponseSchema,
			dataFx: s3PreSignFx({
				userId: user.id,
				path: data.path,
				extension: data.extension,
			}),
		}).pipe(
			withS3ConfigFn(withS3ConfigEnvFn()),
			withUploadConfigFn(withUploadConfigEnvFn()),
			withLoggerFn(rootLogger),
			withDateServiceFn(),
			withKyselyFn(database),
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
