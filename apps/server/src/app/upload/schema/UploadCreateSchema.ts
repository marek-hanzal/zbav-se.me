import { z } from "@hono/zod-openapi";

export const UploadCreateSchema = z
	.looseObject({
		url: z.url().openapi({
			description: "Public URL to the uploaded file",
		}),
	})
	.strip()
	.openapi("UploadCreate", {
		description: "Data for creating a new upload",
	});

export type UploadCreateSchema = typeof UploadCreateSchema;

export namespace UploadCreateSchema {
	export type Type = z.infer<UploadCreateSchema>;
}
