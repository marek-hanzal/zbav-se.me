import { z } from "zod";

export const HandleUploadResponseSchema = z
	.union([
		z.object({
			type: z.literal("blob.generate-client-token"),
			clientToken: z.string(),
		}),
		z.object({
			type: z.literal("blob.upload-completed"),
			response: z.literal("ok"),
		}),
	])
	.openapi("HandleUploadResponse");
