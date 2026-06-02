import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { withS3Fx } from "~/common/s3/server/context/withS3Fx";
import { s3PreSignFx } from "~/common/s3/server/fx/s3PreSignFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerS3Schema } from "~/server/env/ServerS3Schema";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { S3PreSignRequestSchema } from "~/user/s3/server/schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "~/user/s3/server/schema/S3PreSignResponseSchema";
import { withUploadFx } from "~/user/upload/server/context/withUploadFx";

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

		const s3Config = ServerS3Schema.parse(process.env);
		const viteConfig = ViteEnvSchema.parse(process.env);

		return zodGuardFx({
			schema: S3PreSignResponseSchema,
			dataFx: s3PreSignFx({
				userId: user.id,
				path: data.path,
				extension: data.extension,
			}),
		}).pipe(
			withS3Fx({
				api: s3Config.SERVER_S3_API,
				bucket: s3Config.SERVER_S3_BUCKET,
				key: s3Config.SERVER_S3_KEY,
				secret: s3Config.SERVER_S3_SECRET,
			}),
			withUploadFx({
				cdn: viteConfig.VITE_CONTENT_CDN,
			}),
			withLoggerFx(rootLogger),
			withDateFx,
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
