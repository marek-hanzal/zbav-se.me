import z from "zod";

export const ServerS3Schema = z.object({
	SERVER_S3_API: z.string().min(1, "S3 API endpoint is required"),
	SERVER_S3_KEY: z.string().min(1, "S3 key is required"),
	SERVER_S3_SECRET: z.string().min(1, "S3 secret is required"),
	SERVER_S3_BUCKET: z.string().min(1, "S3 bucket is required"),
});
