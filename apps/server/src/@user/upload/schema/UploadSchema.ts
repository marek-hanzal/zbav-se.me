import { z } from "@hono/zod-openapi";
import { UploadDbSchema } from "~/@user/upload/schema/UploadDbSchema";

export const UploadSchema = z
	.looseObject({
		...UploadDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.openapi("Upload", {
		description: "Upload file metadata",
	});

export type UploadSchema = typeof UploadSchema;

export namespace UploadSchema {
	export type Type = z.infer<UploadSchema>;
}
