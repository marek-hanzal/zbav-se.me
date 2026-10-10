import type { s3Config } from "~/s3/context/s3ConfigFx";
import { ServerS3Schema } from "~/server-env/schema/ServerS3Schema";

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
