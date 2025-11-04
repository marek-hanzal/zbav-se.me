import { z } from "@hono/zod-openapi";

export const UploadDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the upload",
	}),
	userId: z.string().openapi({
		description: "ID of the user who owns the upload",
	}),
	url: z.url().openapi({
		description: "Public URL to the uploaded file",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type UploadDbSchema = typeof UploadDbSchema;

export namespace UploadDbSchema {
	export type Type = z.infer<typeof UploadDbSchema>;
}
