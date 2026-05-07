import { Effect } from "effect";
import { Client } from "minio";
import { getLoggerFx } from "@/lib/common/log";
import { S3ContextFx } from "~/common/s3/server/context/S3ContextFx";

export const s3ClientFx = Effect.fn("s3ClientFx")(function* () {
	const logger = yield* getLoggerFx("s3ClientFx");
	logger.trace("s3ClientFx");

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
