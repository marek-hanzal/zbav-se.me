import { z } from "zod";
import { UploadTableSchema } from "~/server/database/@table/UploadTableSchema";

export const UploadSchema = z
	.looseObject({
		...UploadTableSchema.shape,
	})
	.omit({
		userId: true,
		access: true,
		createdAt: true,
	})
	.strip()
	.meta({
		id: "Upload",
		description: "Upload file metadata",
	});

export type UploadSchema = typeof UploadSchema;

export namespace UploadSchema {
	export type Type = z.infer<UploadSchema>;
}
