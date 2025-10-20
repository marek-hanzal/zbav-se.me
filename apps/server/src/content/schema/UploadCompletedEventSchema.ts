import { z } from "zod";
import { PutBlobResultSchema } from "./PutBlobResultSchema";

export const UploadCompletedEventSchema = z
	.object({
		type: z.literal("blob.upload-completed"),
		payload: z.object({
			blob: PutBlobResultSchema,
			tokenPayload: z.string().nullable().optional(),
		}),
	})
	.openapi("UploadCompletedEvent");
