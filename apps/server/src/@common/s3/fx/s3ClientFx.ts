import { Effect } from "effect";
import { Client } from "minio";
import { S3ContextFx } from "~/@common/s3/context/S3ContextFx";

export const s3ClientFx = Effect.fn("s3ClientFx")(function* () {
	const context = yield* S3ContextFx;

	return new Client({
		endPoint: context.api,
		port: 443,
		useSSL: true,
		accessKey: context.key,
		secretKey: context.secret,
	});
});

export type s3ClientFx = ReturnType<typeof s3ClientFx>;
