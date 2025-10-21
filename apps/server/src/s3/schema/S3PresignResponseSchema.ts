import { z } from "zod";

export const S3PresignResponseSchema = z
	.object({
		url: z.string().url("Must be a valid URL"),
		fields: z.record(z.string(), z.string()).optional(),
	})
	.openapi("S3PresignResponse");
