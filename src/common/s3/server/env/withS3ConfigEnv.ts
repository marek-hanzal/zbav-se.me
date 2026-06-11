import { ServerS3Schema } from "~/server/env/ServerS3Schema";
import type { s3Config } from "../context/s3ConfigFx";

export const withS3ConfigEnv = (): s3Config => {
	const { SERVER_S3_API, SERVER_S3_BUCKET, SERVER_S3_KEY, SERVER_S3_SECRET } =
		ServerS3Schema.parse(process.env);

	return {
		api: SERVER_S3_API,
		bucket: SERVER_S3_BUCKET,
		key: SERVER_S3_KEY,
		secret: SERVER_S3_SECRET,
	};
};
