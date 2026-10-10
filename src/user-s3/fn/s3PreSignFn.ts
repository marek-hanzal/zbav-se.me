import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withS3ConfigFx } from "~/s3/context/withS3ConfigFx";
import { s3PreSignFx } from "~/s3/fx/s3PreSignFx";
import { withS3ConfigEnv } from "~/s3/schema/withS3ConfigEnv";
import { S3PreSignRequestSchema } from "~/user-s3/schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "~/user-s3/schema/S3PreSignResponseSchema";
import { withUploadConfigFx } from "~/user-upload/context/withUploadConfigFx";
import { withUploadConfigEnv } from "~/user-upload/schema/withUploadConfigEnv";
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
			withS3ConfigFx(withS3ConfigEnv()),
			withUploadConfigFx(withUploadConfigEnv()),
			withLoggerFx(rootLogger),
			withDateServiceFx(),
			withKyselyFx(database),
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
