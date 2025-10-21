import { Client } from "minio";
import { AppEnv } from "./AppEnv";

export const s3 = new Client({
	endPoint: AppEnv.S3_API,
	port: 443,
	useSSL: true,
	accessKey: AppEnv.S3_KEY,
	secretKey: AppEnv.S3_SECRET,
});
