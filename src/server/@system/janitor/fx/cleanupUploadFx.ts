import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { S3ContextFx } from "~/common/s3/server/context/S3ContextFx";
import { s3ClientFx } from "~/common/s3/server/fx/s3ClientFx";
import type { CleanupSchema } from "~/server/@system/janitor/schema/CleanupSchema";
import { dbFx } from "~/server/database/fx/dbFx";

export const cleanupUploadFx = Effect.fn("cleanupUpload")(function* () {
	const dateContext = yield* DateContextFx;
	const { bucket } = yield* S3ContextFx;

	const client = yield* s3ClientFx();

	const limit = 512;
	const maxScan = 5000;

	const cutoffDate = dateContext
		.now()
		.minus({
			days: 3,
		})
		.toJSDate();

	const uploads = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("upload as u")
			.where("u.createdAt", "<", cutoffDate)
			.where(({ not, exists, selectFrom }) =>
				not(
					exists(
						selectFrom("gallery_item as gi")
							.select("gi.id")
							.whereRef("gi.uploadId", "=", "u.id"),
					),
				),
			)
			.select([
				"u.url",
			])
			.execute();
	});

	const urls = new Set(uploads.map((r) => new URL(r.url).pathname));

	let scanned = 0;
	const kill: string[] = [];

	yield* Effect.promise(async () => {
		return new Promise<void>((resolve, reject) => {
			const stream = client.listObjectsV2(bucket, "", true);

			stream.on("data", (obj) => {
				if (scanned >= maxScan) {
					stream.removeAllListeners();
					return resolve();
				}

				scanned++;

				if (!obj.name || obj.name.endsWith("/")) {
					return;
				}

				if (!urls.has(`/${obj.name}`) && kill.length < limit) {
					kill.push(obj.name);
				}
			});

			stream.on("end", resolve);
			stream.on("error", reject);
		});
	});

	yield* Effect.promise(async () => {
		return client.removeObjects(bucket, kill);
	});

	return {
		type: "upload",
		total: scanned,
		deleted: kill.length,
	} satisfies CleanupSchema.Type;
});
