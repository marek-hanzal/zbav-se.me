import { randomUUID } from "node:crypto";
import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { rangedom } from "@/lib/common/rangedom/rangedom";
import { S3ContextFx } from "~/common/s3/server/context/S3ContextFx";
import { s3ClientFx } from "~/common/s3/server/fx/s3ClientFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import { SeedProgressContextFx } from "./SeedProgressContextFx";

const MAX_UPLOAD_FETCH = 128;
const MAX_PHOTOBANK_FETCH_PER_RUN = 64;
const PHOTOBANK_FETCH_CONCURRENCY = 3;
const UPLOAD_INSERT_CHUNK = 1000;

const fetchPhotoBufferFx = Effect.fn("fetchPhotoBufferFx")(function* () {
	const target = `https://picsum.photos/seed/${genId()}/1024/768.jpg`;

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

	return yield* Effect.tryPromise({
		try: async () => Buffer.from(await response.arrayBuffer()),
		catch: (cause) =>
			new RuntimeErrorFx({
				message: "Failed to read photobank response body",
				cause,
			}),
	});
});

export namespace ensureSeedUploadPoolFx {
	export interface Props {
		userId: string;
		targetCount: number;
	}
}

export const ensureSeedUploadPoolFx = Effect.fn("ensureSeedUploadPoolFx")(function* ({
	userId,
	targetCount,
}: ensureSeedUploadPoolFx.Props) {
	const progress = yield* SeedProgressContextFx;
	const { bucket } = yield* S3ContextFx;
	const { cdn } = yield* UploadContextFx;

	const existingByUser = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("upload")
			.select([
				"id",
				"url",
			])
			.where("userId", "=", userId)
			.orderBy("createdAt", "desc")
			.limit(MAX_UPLOAD_FETCH)
			.execute();
	});

	const pool = existingByUser.map((item) => ({
		id: item.id,
		url: item.url,
	}));
	const desiredPoolSize = Math.min(MAX_UPLOAD_FETCH, Math.max(1, targetCount));
	const missingPool = Math.max(0, desiredPoolSize - pool.length);
	let created = 0;

	if (missingPool <= 0) {
		return pool.map((item) => item.id);
	}

	const s3 = yield* s3ClientFx();
	const fetchBudget = Math.min(MAX_PHOTOBANK_FETCH_PER_RUN, missingPool);
	const fetched = yield* Effect.forEach(
		Array.from({
			length: fetchBudget,
		}),
		() => {
			return Effect.gen(function* () {
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
							message: "Failed to upload seed image to S3",
							cause,
						}),
				});

				const upload = yield* uploadCreateFx({
					access: "private",
					userId,
					url: `${cdn.replace(/\/$/, "")}/${key}`,
				});

				yield* progress.log({
					message: `Uploaded [${upload.url}]`,
				});
				yield* progress.advance({
					delta: 1,
				});

				return {
					id: upload.id,
					url: upload.url,
				};
			});
		},
		{
			concurrency: PHOTOBANK_FETCH_CONCURRENCY,
		},
	);

	pool.push(...fetched);
	created += fetched.length;

	let remaining = Math.max(0, desiredPoolSize - pool.length);

	while (remaining > 0 && pool.length > 0) {
		const chunk = Math.min(remaining, UPLOAD_INSERT_CHUNK);
		const rows: Array<{
			id: string;
			userId: string;
			url: string;
			access: "private";
			createdAt: Date;
		}> = [];

		for (let index = 0; index < chunk; index += 1) {
			const source = pool[rangedom(0, pool.length - 1)];

			if (!source) {
				break;
			}

			rows.push({
				id: genId(),
				userId,
				url: source.url,
				access: "private",
				createdAt: new Date(),
			});
		}

		if (rows.length === 0) {
			break;
		}

		yield* dbFx(async (kysely) => {
			return kysely.insertInto("upload").values(rows).execute();
		});

		for (const row of rows) {
			pool.push({
				id: row.id,
				url: row.url,
			});
		}

		created += rows.length;
		remaining -= rows.length;
		yield* progress.advance({
			delta: rows.length,
		});
	}

	yield* progress.log({
		message: `Upload pool ready (${pool.length} records, created ${created})`,
	});

	return pool.map((item) => item.id);
});

export type ensureSeedUploadPoolFx = ReturnType<typeof ensureSeedUploadPoolFx>;
