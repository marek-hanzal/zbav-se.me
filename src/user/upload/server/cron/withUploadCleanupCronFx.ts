import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { S3ContextFx } from "~/common/s3/server/context/S3ContextFx";
import { withS3Fx } from "~/common/s3/server/context/withS3Fx";
import { s3ClientFx } from "~/common/s3/server/fx/s3ClientFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { ServerS3Schema } from "~/server/env/ServerS3Schema";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { withUploadFx } from "~/user/upload/server/context/withUploadFx";

export namespace withUploadCleanupCronFx {
	export interface Props {
		count: number;
	}
}

export const withUploadCleanupCronFx = Effect.fn("withUploadCleanupCronFx")(function* ({
	count,
}: withUploadCleanupCronFx.Props) {
	const s3Config = ServerS3Schema.parse(process.env);
	const viteConfig = ViteEnvSchema.parse(process.env);

	return yield* Effect.gen(function* () {
		const logger = yield* getLoggerFx("withUploadCleanupCronFx", "cron");
		logger.trace("withUploadCleanupCronFx", {
			count,
		});

		const dateContext = yield* DateContextFx;
		const { bucket } = yield* S3ContextFx;
		const { cdn } = yield* UploadContextFx;
		const client = yield* s3ClientFx();
		const cdnUrlLike = `${cdn.replace(/\/$/, "")}/%`;

		const cutoffDate = dateContext
			.now()
			.minus({
				months: 3,
			})
			.toJSDate();

		const uploads = yield* dbFx(async (kysely) => {
			const baseSelect = kysely
				.selectFrom("upload as u")
				.where("u.createdAt", "<=", cutoffDate)
				.where("u.url", "like", cdnUrlLike)
				.where(({ not, exists, selectFrom }) =>
					not(
						exists(
							selectFrom("gallery_item as gi")
								.select("gi.id")
								.whereRef("gi.uploadId", "=", "u.id"),
						),
					),
				)
				.where(({ not, exists, selectFrom }) =>
					not(
						exists(
							selectFrom("feed as f")
								.select("f.id")
								.whereRef("f.uploadId", "=", "u.id"),
						),
					),
				);

			return baseSelect
				.select([
					"u.id",
					"u.url",
				])
				.orderBy("u.createdAt", "asc")
				.orderBy("u.id", "asc")
				.limit(count)
				.execute();
		});

		const orphans = uploads.flatMap((upload) => {
			const key = new URL(upload.url).pathname.replace(/^\//, "");

			return key
				? [
						{
							id: upload.id,
							key,
						},
					]
				: [];
		});

		if (orphans.length === 0) {
			return;
		}

		yield* Effect.promise(async () => {
			return client.removeObjects(
				bucket,
				orphans.map((orphan) => orphan.key),
			);
		});

		yield* dbFx(async (kysely) => {
			const baseSelect = kysely
				.selectFrom("upload as u")
				.where("u.createdAt", "<=", cutoffDate)
				.where("u.url", "like", cdnUrlLike)
				.where(({ not, exists, selectFrom }) =>
					not(
						exists(
							selectFrom("gallery_item as gi")
								.select("gi.id")
								.whereRef("gi.uploadId", "=", "u.id"),
						),
					),
				)
				.where(({ not, exists, selectFrom }) =>
					not(
						exists(
							selectFrom("feed as f")
								.select("f.id")
								.whereRef("f.uploadId", "=", "u.id"),
						),
					),
				);

			const source = baseSelect
				.select("u.id")
				.orderBy("u.createdAt", "asc")
				.orderBy("u.id", "asc")
				.limit(orphans.length);

			return kysely.deleteFrom("upload").where("id", "in", source).execute();
		});
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
	);
});

export type withUploadCleanupCronFx = ReturnType<typeof withUploadCleanupCronFx>;
