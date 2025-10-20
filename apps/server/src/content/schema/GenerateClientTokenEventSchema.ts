import { z } from "zod";

export const GenerateClientTokenEventSchema = z
	.object({
		type: z.literal("blob.generate-client-token"),
		payload: z.object({
			pathname: z.string(),
			multipart: z.boolean(),
			clientPayload: z.string().nullable(),
		}),
	})
	.openapi("GenerateClientTokenEvent");
