import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import type { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { S3ContextFx } from "~/@common/s3/context/S3ContextFx";
import { s3ClientFx } from "~/@common/s3/fx/s3ClientFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export const cleanupUploadFx = Effect.fn("cleanupUpload")(function* () {
	const { kysely } = yield* KyselyContextFx;
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

	const uploads = yield* Effect.promise(async () => {
		return kysely
			.selectFrom("upload as u")
			.leftJoin("gallery_item as gi", "gi.uploadId", "u.id")
			.leftJoin("gallery as g", "gi.uploadId", "u.id")
			.where("u.createdAt", "<", cutoffDate)
			.select([
				"u.url",
			])
			.execute();
	});

	const urls = uploads.map((r) => new URL(r.url).pathname);

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
				if (!urls.includes(`/${obj.name}`) && kill.length < limit) {
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
