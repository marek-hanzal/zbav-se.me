import { z } from "zod";
import { FieldTypeEnumSchema } from "./FieldTypeEnumSchema";

export const FieldTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the field",
		}),
		name: z.string().meta({
			description: "Name of the field",
		}),
		type: FieldTypeEnumSchema.meta({
			description: "Type of the field",
		}),
		required: z.boolean().meta({
			description: "Whether the field is required",
		}),
	})
	.meta({
		id: "FieldTable",
		description: "Database row for a field.",
	})
	.strip();

export type FieldTableSchema = typeof FieldTableSchema;

export namespace FieldTableSchema {
	export type Type = z.infer<FieldTableSchema>;
}
