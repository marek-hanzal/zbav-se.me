import { z } from "zod";
import { AccessEnumSchema } from "~/common/access/AccessEnumSchema";

export const UploadTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the upload",
		}),
		userId: z.string().meta({
			description: "ID of the user who owns the upload",
		}),
		url: z.url().meta({
			description: "Public URL to the uploaded file",
		}),
		access: AccessEnumSchema.meta({
			description: "Visibility of the upload",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "UploadTable",
		description: "Database row for an uploaded file.",
	})
	.strip();

export type UploadTableSchema = typeof UploadTableSchema;

export namespace UploadTableSchema {
	export type Type = z.infer<typeof UploadTableSchema>;
}
