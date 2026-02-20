import { randomUUID } from "node:crypto";
import { DateContextFx } from "@use-pico/common/date";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { S3ContextFx } from "~/@common/s3/context/S3ContextFx";
import { s3ClientFx } from "~/@common/s3/fx/s3ClientFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { RuntimeErrorFx } from "~/error/RuntimeErrorFx";
import { SeedProgressContextFx } from "~/seed/context/SeedProgressContextFx";

const MAX_UPLOAD_FETCH = 128;
const MAX_PHOTOBANK_FETCH_PER_RUN = 64;
const PHOTOBANK_FETCH_CONCURRENCY = 3;
const UPLOAD_INSERT_CHUNK = 1000;

const fetchPhotoBufferFx = Effect.fn("fetchPhotoBufferFx")(function* () {
	const sig = genId();
	const target = `https://picsum.photos/seed/${sig}/1024/768.jpg`;

	const response = yield* Effect.tryPromise({
		try: async () => fetch(target),
		catch: (cause) =>
			new RuntimeErrorFx({
				message: "Failed to fetch image from photobank",
				cause,
			}),
	});

	if (!response.ok) {
		return yield* new RuntimeErrorFx({
			message: `Photobank fetch failed with status ${response.status}`,
		});
	}

	const buffer = yield* Effect.tryPromise({
		try: async () => Buffer.from(await response.arrayBuffer()),
		catch: (cause) =>
			new RuntimeErrorFx({
				message: "Failed to read photobank response body",
				cause,
			}),
	});

	return buffer;
});

export const seedCoreUploadFx = Effect.fn("seedCoreUploadFx")(function* ({
	userId,
	cdn,
	deficit,
}: {
	userId: string;
	cdn: string;
	deficit: number;
}) {
	const progress = yield* SeedProgressContextFx;
	const { kysely } = yield* KyselyContextFx;
	const { bucket } = yield* S3ContextFx;
	const dateContext = yield* DateContextFx;

	const existingByUser = yield* tryDbFx(async () =>
		kysely
			.selectFrom("upload")
			.select([
				"id",
				"url",
			])
			.where("userId", "=", userId)
			.orderBy("createdAt", "desc")
			.limit(MAX_UPLOAD_FETCH)
			.execute(),
	);

	const pool = existingByUser.map((item) => ({
		id: item.id,
		url: item.url,
	}));

	let created = 0;
	const targetPoolSize = Math.min(MAX_UPLOAD_FETCH, Math.max(1, deficit));
	const missingPool = Math.max(0, targetPoolSize - pool.length);
	if (missingPool > 0) {
		const s3 = yield* s3ClientFx();
		const photobankBudget = Math.min(MAX_PHOTOBANK_FETCH_PER_RUN, missingPool);
		const fetched = yield* Effect.forEach(
			Array.from({
				length: photobankBudget,
			}),
			() =>
				Effect.gen(function* () {
					const data = yield* fetchPhotoBufferFx();
					const key = `${userId}/seed/${randomUUID()}.jpg`;

					yield* Effect.tryPromise({
						try: async () => {
							await s3.putObject(bucket, key, data, data.length, {
								"Content-Type": "image/jpeg",
							});
						},
						catch: (cause) =>
							new RuntimeErrorFx({
								message: "Failed to upload image to S3",
								cause,
							}),
					});

					const upload = yield* uploadCreateFx({
						userId,
						url: `${cdn.replace(/\/$/, "")}/${key}`,
					});

					yield* progress.advance({
						delta: 1,
					});

					return {
						id: upload.id,
						url: upload.url,
					};
				}),
			{
				concurrency: PHOTOBANK_FETCH_CONCURRENCY,
			},
		);

		pool.push(...fetched);
		created += fetched.length;
	}

	if (deficit > 0 && pool.length > 0) {
		let remaining = Math.max(0, deficit - created);
		while (remaining > 0) {
			const chunk = Math.min(remaining, UPLOAD_INSERT_CHUNK);
			const now = dateContext.now().toJSDate();

			const rows: Array<{
				id: string;
				userId: string;
				url: string;
				createdAt: Date;
			}> = [];

			for (let i = 0; i < chunk; i++) {
				const source = pool[Math.floor(Math.random() * pool.length)];
				if (!source) {
					break;
				}
				rows.push({
					id: genId(),
					userId,
					url: source.url,
					createdAt: now,
				});
			}

			if (rows.length === 0) {
				break;
			}

			yield* tryDbFx(async () => kysely.insertInto("upload").values(rows).execute());

			for (const row of rows) {
				pool.push({
					id: row.id,
					url: row.url,
				});
			}

			remaining -= rows.length;
			created += rows.length;
			yield* progress.advance({
				delta: rows.length,
			});
		}
	}

	yield* progress.log({
		message: `Upload pool ready (${pool.length} records for seed user)`,
	});

	return pool.map((item) => item.id);
});

export type seedCoreUploadFx = ReturnType<typeof seedCoreUploadFx>;
