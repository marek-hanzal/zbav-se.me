import { z } from "zod";

export const S3PresignQuerySchema = z
	.object({
		key: z.string().min(1, "Key is required"),
		contentType: z.string().min(1, "Content type is required"),
		bucket: z.string().min(1, "Bucket is required"),
	})
	.openapi("S3PresignQuery");
