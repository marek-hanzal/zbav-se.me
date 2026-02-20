import { randomUUID } from "node:crypto";
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

	const existingByUser = yield* tryDbFx(async () =>
		kysely
			.selectFrom("upload")
			.select([
				"id",
				"url",
			])
			.where("userId", "=", userId)
			.orderBy("createdAt", "desc")
			.limit(Math.max(MAX_UPLOAD_FETCH, deficit))
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
		for (let i = 0; i < missingPool; i++) {
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

			pool.push({
				id: upload.id,
				url: upload.url,
			});
			created += 1;
			yield* progress.advance({
				delta: 1,
			});
		}
	}

	if (deficit > 0 && pool.length > 0) {
		let remaining = Math.max(0, deficit - created);
		while (remaining > 0) {
			const source = pool[Math.floor(Math.random() * pool.length)];
			if (!source) {
				break;
			}
			const upload = yield* uploadCreateFx({
				userId,
				url: source.url,
			});
			pool.push({
				id: upload.id,
				url: upload.url,
			});
			remaining -= 1;
			created += 1;
			yield* progress.advance({
				delta: 1,
			});
		}
	}

	yield* progress.log({
		message: `Upload pool ready (${pool.length} records for seed user)`,
	});

	return pool.map((item) => item.id);
});

export type seedCoreUploadFx = ReturnType<typeof seedCoreUploadFx>;
