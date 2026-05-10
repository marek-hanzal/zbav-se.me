import { readFile } from "node:fs/promises";
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

export async function uploadFixtureViaS3({ database, userId, path }: uploadFixtureViaS3.Props) {
	const s3Config = ServerS3Schema.parse(process.env);
	const body = await readFile(path);

	const presign = await s3PreSignFx({
		userId,
		path: genId(),
		extension: "png",
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
			"Content-Type": "image/png",
		},
		body,
	});

	if (!response.ok) {
		throw new Error(`S3 upload failed with status ${response.status}`);
	}

	return await uploadCreateFx({
		userId,
		access: "public",
		url: presign.cdn,
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}
