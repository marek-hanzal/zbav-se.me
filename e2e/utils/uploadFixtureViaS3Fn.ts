import { readFile } from "node:fs/promises";
import path from "node:path";
import { Effect } from "effect";
import { genIdFn } from "~/identity/fn/genIdFn";
import { withS3ConfigEnvFn } from "~/s3/fn/withS3ConfigEnvFn";
import { withS3ConfigFn } from "~/s3/fn/withS3ConfigFn";
import { s3PreSignFx } from "~/s3/fx/s3PreSignFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { uploadCreateFx } from "~/user-upload/fx/uploadCreateFx";
import type { testabaseFn } from "./testabaseFn";
import { waitForPublicImageFn } from "./waitForPublicImageFn";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;

export namespace uploadFixtureViaS3Fn {
	export interface Props {
		database: TestDatabase;
		userId: string;
		path: string;
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

	const deadline = performance.now() + 30_000;
	let response: Response;
	try {
		response = await fetch(presign.url, {
			method: "PUT",
			headers: {
				"Content-Type": uploadType.contentType,
			},
			body,
			signal: AbortSignal.timeout(10_000),
		});
	} catch (error) {
		const detail = error instanceof Error ? error.message : "Unknown request error";
		throw new Error(
			`S3 fixture upload request failed: ${detail.replaceAll(presign.url, "[request URL]").replace(/https?:\/\/\S+/g, "[request URL]")}`,
		);
	}

	try {
		if (!response.ok) {
			throw new Error(`S3 fixture upload failed with HTTP ${response.status}`);
		}
	} finally {
		await response.body?.cancel().catch(() => undefined);
	}

	const upload = await uploadCreateFx({
		userId,
		access: "public",
		url: presign.cdn,
	}).pipe(withRuntimeFn(database), Effect.runPromise);

	const remainingMs = Math.ceil(deadline - performance.now());
	if (remainingMs <= 0) {
		throw new Error(
			"S3 fixture upload exhausted its 30000 ms deadline before CDN verification",
		);
	}
	await waitForPublicImageFn({
		url: upload.url,
		timeoutMs: remainingMs,
	});

	return upload;
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
