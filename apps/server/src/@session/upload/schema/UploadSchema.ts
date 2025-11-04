import { z } from "@hono/zod-openapi";
import { UploadDbSchema } from "./UploadDbSchema";

export const UploadSchema = z
	.object({
		...UploadDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("Upload", {
		description: "Upload data transfer object",
	});

export type UploadSchema = typeof UploadSchema;

export namespace UploadSchema {
	export type Type = z.infer<UploadSchema>;
}
