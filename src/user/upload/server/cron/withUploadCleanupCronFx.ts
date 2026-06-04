import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { s3ConfigFx } from "~/common/s3/server/context/s3ConfigFx";
import { withS3ConfigFx } from "~/common/s3/server/context/withS3ConfigFx";
import { withS3ConfigEnv } from "~/common/s3/server/env/withS3ConfigEnv";
import { s3ClientFx } from "~/common/s3/server/fx/s3ClientFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { UploadConfigFx } from "../context/UploadConfigFx";
import { withUploadConfigFx } from "../context/withUploadConfigFx";
import { withUploadConfigEnv } from "../env/withUploadConfigEnv";

export namespace withUploadCleanupCronFx {
	export interface Props {
		count: number;
	}
}

export const withUploadCleanupCronFx = Effect.fn("withUploadCleanupCronFx")(function* ({
	count,
}: withUploadCleanupCronFx.Props) {
	return yield* Effect.gen(function* () {
		const logger = yield* getLoggerFx("withUploadCleanupCronFx", "cron");
		logger.trace("withUploadCleanupCronFx", {
			count,
		});

		const dateContext = yield* DateContextFx;
		const { bucket } = yield* s3ConfigFx;
		const { cdn } = yield* UploadConfigFx;
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
	}).pipe(withS3ConfigFx(withS3ConfigEnv()), withUploadConfigFx(withUploadConfigEnv()));
});

export type withUploadCleanupCronFx = ReturnType<typeof withUploadCleanupCronFx>;
