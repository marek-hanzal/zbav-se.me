import { z } from "@hono/zod-openapi";
import { UploadDbSchema } from "~/app/upload/schema/UploadDbSchema";

export const UploadSchema = z
	.object({
		...UploadDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("Upload", {
		description: "Upload file metadata",
	});

export type UploadSchema = typeof UploadSchema;

export namespace UploadSchema {
	export type Type = z.infer<UploadSchema>;
}
