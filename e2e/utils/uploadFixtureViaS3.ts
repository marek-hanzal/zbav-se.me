import { readFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { withS3Fx } from "~/common/s3/server/context/withS3Fx";
import { s3PreSignFx } from "~/common/s3/server/fx/s3PreSignFx";
import { ServerS3Schema } from "~/server/env/ServerS3Schema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import type { testabase } from "./testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export namespace uploadFixtureViaS3 {
	export interface Props {
		database: TestDatabase;
		userId: string;
		path: string;
	}
}

async function waitForPublicImage(url: string) {
	const startedAt = Date.now();
	const timeoutMs = 30_000;

	while (Date.now() - startedAt < timeoutMs) {
		try {
			const response = await fetch(url, {
				cache: "no-store",
			});
			const contentType = response.headers.get("content-type");

			if (response.ok && contentType?.startsWith("image/")) {
				return;
			}
		} catch {
			// Ignore transient CDN/network failures while the object becomes available.
		}

		await delay(500);
	}

	throw new Error(`Uploaded image did not become publicly available in time: ${url}`);
}

function resolveUploadType(filePath: string) {
	const extension = path.extname(filePath).toLowerCase();

	switch (extension) {
		case ".jpg":
		case ".jpeg":
			return {
				extension: "jpg",
				contentType: "image/jpeg",
			} as const;
		case ".png":
			return {
				extension: "png",
				contentType: "image/png",
			} as const;
		case ".webp":
			return {
				extension: "webp",
				contentType: "image/webp",
			} as const;
		default:
			throw new Error(`Unsupported fixture extension: ${extension}`);
	}
}

export async function uploadFixtureViaS3({ database, userId, path }: uploadFixtureViaS3.Props) {
	const s3Config = ServerS3Schema.parse(process.env);
	const body = await readFile(path);
	const uploadType = resolveUploadType(path);

	const presign = await s3PreSignFx({
		userId,
		path: genId(),
		extension: uploadType.extension,
	}).pipe(
		withRuntimeFx(database),
		withS3Fx({
			api: s3Config.SERVER_S3_API,
			bucket: s3Config.SERVER_S3_BUCKET,
			key: s3Config.SERVER_S3_KEY,
			secret: s3Config.SERVER_S3_SECRET,
		}),
		Effect.runPromise,
	);

	const response = await fetch(presign.url, {
		method: "PUT",
		headers: {
			"Content-Type": uploadType.contentType,
		},
		body,
	});

	if (!response.ok) {
		throw new Error(`S3 upload failed with status ${response.status}`);
	}

	const upload = await uploadCreateFx({
		userId,
		access: "public",
		url: presign.cdn,
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	await waitForPublicImage(upload.url);

	return upload;
}
