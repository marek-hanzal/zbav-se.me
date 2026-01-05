import { DateTime } from "luxon";
import type { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { AppEnv } from "~/AppEnv";
import { database } from "~/database/kysely";
import { s3 } from "~/s3";

export async function cleanupUpload(): Promise<CleanupSchema.Type> {
	const limit = 512;
	const maxScan = 5000;

	const cutoffDate = DateTime.now()
		.minus({
			days: 3,
		})
		.toJSDate();

	const kysely = await database.kysely();

	const uploads = await kysely
		.selectFrom("upload as u")
		.leftJoin("gallery_item as gi", "gi.uploadId", "u.id")
		.leftJoin("gallery as g", "gi.uploadId", "u.id")
		.where("u.createdAt", "<", cutoffDate)
		.select([
			"u.url",
		])
		.execute();

	const urls = uploads.map((r) => new URL(r.url).pathname);

	let scanned = 0;
	const kill: string[] = [];

	await new Promise<void>((resolve, reject) => {
		const stream = s3.listObjectsV2(AppEnv.SERVER_S3_BUCKET, "", true);

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

	await s3.removeObjects(AppEnv.SERVER_S3_BUCKET, kill);

	return {
		type: "upload",
		total: scanned,
		deleted: kill.length,
	};
}
