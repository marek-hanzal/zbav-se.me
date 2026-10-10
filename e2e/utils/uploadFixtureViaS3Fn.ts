import { readFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { Effect } from "effect";
import { genIdFn } from "~/identity/fn/genIdFn";
import { withS3ConfigEnvFn } from "~/s3/fn/withS3ConfigEnvFn";
import { withS3ConfigFn } from "~/s3/fn/withS3ConfigFn";
import { s3PreSignFx } from "~/s3/fx/s3PreSignFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { uploadCreateFx } from "~/user-upload/fx/uploadCreateFx";
import type { testabaseFn } from "./testabaseFn";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;

export namespace uploadFixtureViaS3Fn {
	export interface Props {
		database: TestDatabase;
		userId: string;
		path: string;
	}
}

async function waitForPublicImageFn(url: string) {
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

function resolveUploadTypeFn(filePath: string) {
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

export async function uploadFixtureViaS3Fn({ database, userId, path }: uploadFixtureViaS3Fn.Props) {
	const body = await readFile(path);
	const uploadType = resolveUploadTypeFn(path);

	const presign = await s3PreSignFx({
		userId,
		path: genIdFn(),
		extension: uploadType.extension,
	}).pipe(withRuntimeFn(database), withS3ConfigFn(withS3ConfigEnvFn()), Effect.runPromise);

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
	}).pipe(withRuntimeFn(database), Effect.runPromise);

	await waitForPublicImageFn(upload.url);

	return upload;
}
