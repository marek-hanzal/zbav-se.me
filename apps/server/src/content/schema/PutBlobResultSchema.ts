import { z } from "zod";

export const PutBlobResultSchema = z
	.looseObject({
		url: z.url(),
		downloadUrl: z.url(),
		pathname: z.string(),
		size: z.number().int().nonnegative(),
		uploadedAt: z.string(),
		contentType: z.string(),
		contentDisposition: z.string(),
	})
	.openapi("PutBlobResult");
