import { Client } from "minio";
import { AppEnv } from "./AppEnv";

export const s3 = new Client({
	endPoint: AppEnv.SERVER_S3_API,
	port: 443,
	useSSL: true,
	accessKey: AppEnv.SERVER_S3_KEY,
	secretKey: AppEnv.SERVER_S3_SECRET,
});
