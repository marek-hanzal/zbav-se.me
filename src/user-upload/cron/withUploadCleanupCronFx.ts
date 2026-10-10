import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { s3ConfigFx } from "~/s3/context/s3ConfigFx";
import { withS3ConfigEnvFn } from "~/s3/fn/withS3ConfigEnvFn";
import { withS3ConfigFn } from "~/s3/fn/withS3ConfigFn";
import { s3ClientFx } from "~/s3/fx/s3ClientFx";
import { UploadConfigFx } from "~/user-upload/context/UploadConfigFx";
import { withUploadConfigEnvFn } from "~/user-upload/fn/withUploadConfigEnvFn";
import { withUploadConfigFn } from "~/user-upload/fn/withUploadConfigFn";

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

		const dateContext = yield* DateServiceFx;
		const { bucket } = yield* s3ConfigFx;
		const { cdn } = yield* UploadConfigFx;
		const client = yield* s3ClientFx();
		const cdnUrlLike = `${cdn.replace(/\/$/, "")}/%`;

		const cutoffDate = dateContext
			.nowFn()
			.minus({
				months: 3,
			})
			.toJSDate();

		const uploads = yield* dbFx(async (kysely) => {
			const baseSelect = kysely
				.selectFrom("upload as u")
				.where("u.createdAt", "<=", cutoffDate)
				.where("u.url", "like", cdnUrlLike)
				.where(({ not: notFn, exists: existsFn, selectFrom: selectFromFn }) =>
					notFn(
						existsFn(
							selectFromFn("gallery_item as gi")
								.select("gi.id")
								.whereRef("gi.uploadId", "=", "u.id"),
						),
					),
				)
				.where(({ not: notFn, exists: existsFn, selectFrom: selectFromFn }) =>
					notFn(
						existsFn(
							selectFromFn("feed as f")
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
				.where(({ not: notFn, exists: existsFn, selectFrom: selectFromFn }) =>
					notFn(
						existsFn(
							selectFromFn("gallery_item as gi")
								.select("gi.id")
								.whereRef("gi.uploadId", "=", "u.id"),
						),
					),
				)
				.where(({ not: notFn, exists: existsFn, selectFrom: selectFromFn }) =>
					notFn(
						existsFn(
							selectFromFn("feed as f")
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
	}).pipe(withS3ConfigFn(withS3ConfigEnvFn()), withUploadConfigFn(withUploadConfigEnvFn()));
});

export type withUploadCleanupCronFx = ReturnType<typeof withUploadCleanupCronFx>;
