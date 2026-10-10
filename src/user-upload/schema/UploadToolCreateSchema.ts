import { z } from "zod";
import { UploadCreateSchema } from "~/user-upload/schema/UploadCreateSchema";

export const UploadToolCreateSchema = z
	.looseObject({
		...UploadCreateSchema.shape,
	})
	.strip()
	.meta({
		id: "UploadToolCreate",
		description: "Data for creating a new upload via tool",
	});

export type UploadToolCreateSchema = typeof UploadToolCreateSchema;

export namespace UploadToolCreateSchema {
	export type Type = z.infer<UploadToolCreateSchema>;
}
