import { z } from "zod";
import { AccessEnumSchema } from "~/common/access/AccessEnumSchema";

export const UploadCreateSchema = z
	.looseObject({
		url: z.url().meta({
			description: "Public URL to the uploaded file",
		}),
		access: AccessEnumSchema.meta({
			description: "Visibility of the upload",
		}),
	})
	.strip()
	.meta({
		id: "UploadCreate",
		description: "Data for creating a new upload",
	});

export type UploadCreateSchema = typeof UploadCreateSchema;

export namespace UploadCreateSchema {
	export type Type = z.infer<UploadCreateSchema>;
}
