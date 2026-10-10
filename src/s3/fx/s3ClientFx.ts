import { Effect } from "effect";
import { Client } from "minio";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { s3ConfigFx } from "~/s3/context/s3ConfigFx";

export const s3ClientFx = Effect.fn("s3ClientFx")(function* () {
	const logger = yield* getLoggerFx("s3ClientFx");
	logger.trace("s3ClientFx");

	const s3Config = yield* s3ConfigFx;
	const endpoint = new URL(
		s3Config.api.includes("://") ? s3Config.api : `https://${s3Config.api}`,
	);

	return new Client({
		endPoint: endpoint.hostname,
		port: endpoint.port ? Number(endpoint.port) : undefined,
		useSSL: endpoint.protocol === "https:",
		accessKey: s3Config.key,
		secretKey: s3Config.secret,
	});
});

export type s3ClientFx = ReturnType<typeof s3ClientFx>;
