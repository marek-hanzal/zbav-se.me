import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDateServiceFx } from "@/lib/common/date";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withS3ConfigFx } from "~/common/s3/server/context/withS3ConfigFx";
import { withS3ConfigEnv } from "~/common/s3/server/env/withS3ConfigEnv";
import { s3PreSignFx } from "~/common/s3/server/fx/s3PreSignFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { S3PreSignRequestSchema } from "~/user/s3/server/schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "~/user/s3/server/schema/S3PreSignResponseSchema";
import { withUploadConfigFx } from "~/user/upload/server/context/withUploadConfigFx";
import { withUploadConfigEnv } from "~/user/upload/server/env/withUploadConfigEnv";

export namespace s3PreSignFn {
	export type Error = Effect.Effect.Error<s3PreSignFx>;
}

export const s3PreSignFn = createServerFn({
	method: "POST",
})
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(S3PreSignRequestSchema)
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
