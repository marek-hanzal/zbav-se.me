import { z } from "@hono/zod-openapi";

export const UploadSchema = z
	.object({
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
	})
	.openapi("Upload", {
		description: "Represents an uploaded file",
	});

export type UploadSchema = typeof UploadSchema;

export namespace UploadSchema {
	export type Type = z.infer<typeof UploadSchema>;
}
