import { z } from "zod";
import { AccessEnumSchema } from "~/access/schema/AccessEnumSchema";
import { WhereSchema } from "~/query/schema/WhereSchema";

export const UploadWhereSchema = z
	.looseObject({
		...WhereSchema.shape,
		userId: z.string().optional().meta({
			description: "This filter matches uploads with the exact userId",
		}),
		access: AccessEnumSchema.optional().meta({
			description: "This filter matches uploads with the exact visibility",
		}),
	})
	.strip()
	.meta({
		id: "UploadWhere",
		description: "App-based filters",
	});

export type UploadWhereSchema = typeof UploadWhereSchema;

export namespace UploadWhereSchema {
	export type Type = z.infer<UploadWhereSchema>;
}
