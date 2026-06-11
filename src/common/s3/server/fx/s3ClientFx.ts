import { Effect } from "effect";
import { Client } from "minio";
import { getLoggerFx } from "@/lib/common/log";
import { s3ConfigFx } from "../context/s3ConfigFx";

export const s3ClientFx = Effect.fn("s3ClientFx")(function* () {
	const logger = yield* getLoggerFx("s3ClientFx");
	logger.trace("s3ClientFx");

	const s3Config = yield* s3ConfigFx;

	return new Client({
		endPoint: s3Config.api,
		port: 443,
		useSSL: true,
		accessKey: s3Config.key,
		secretKey: s3Config.secret,
	});
});

export type s3ClientFx = ReturnType<typeof s3ClientFx>;
