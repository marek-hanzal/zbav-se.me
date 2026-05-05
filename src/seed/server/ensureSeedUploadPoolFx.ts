import { randomUUID } from "node:crypto";
import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { S3ContextFx } from "~/common/s3/server/context/S3ContextFx";
import { s3ClientFx } from "~/common/s3/server/fx/s3ClientFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import { SeedProgressContextFx } from "./SeedProgressContextFx";

const MAX_UPLOAD_FETCH = 128;
const MAX_PHOTOBANK_FETCH_PER_RUN = 64;
const PHOTOBANK_FETCH_CONCURRENCY = 3;

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
	const { kysely } = yield* KyselyContextFx;
	const { bucket } = yield* S3ContextFx;
	const { cdn } = yield* UploadContextFx;

	const existingByUser = yield* tryDbFx(async () => {
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
					access: "public",
					userId,
					url: `${cdn.replace(/\/$/, "")}/${key}`,
				});

				progress.log({
					message: `Uploaded [${upload.url}]`,
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

	return pool.map((item) => item.id);
});

export type ensureSeedUploadPoolFx = ReturnType<typeof ensureSeedUploadPoolFx>;
