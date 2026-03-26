import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withS3Fx } from "~/server/@common/s3/context/withS3Fx";
import { s3PreSignFx } from "~/server/@common/s3/fx/s3PreSignFx";
import { S3PreSignRequestSchema } from "~/server/@user/s3/schema/S3PreSignRequestSchema";
import { S3PreSignResponseSchema } from "~/server/@user/s3/schema/S3PreSignResponseSchema";
import { withUploadFx } from "~/server/@user/upload/context/withUploadFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { ServerCdnSchema } from "~/server/env/ServerCdnSchema";
import { ServerS3Schema } from "~/server/env/ServerS3Schema";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export const s3PreSignFn = createServerFn({
	method: "POST",
})
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(S3PreSignRequestSchema)
	.handler(async ({ data, context: { user } }) => {
		const s3Config = ServerS3Schema.parse(process.env);
		const cdnConfig = ServerCdnSchema.parse(process.env);

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
				cdn: cdnConfig.SERVER_CONTENT_CDN,
			}),
			withCatchFx({
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
