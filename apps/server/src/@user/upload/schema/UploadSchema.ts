import { z } from "@hono/zod-openapi";
import { UploadTableSchema } from "~/database/@table/UploadTableSchema";

export const UploadSchema = z
	.looseObject({
		...UploadTableSchema.shape,
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
