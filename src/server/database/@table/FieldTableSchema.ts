import { z } from "zod";
import { FieldTypeEnumSchema } from "~/user/field/server/schema/FieldTypeEnumSchema";

export const FieldTableSchema = z
	.looseObject({
		name: z.string().meta({
			description: "Name of the field",
		}),
		type: FieldTypeEnumSchema.meta({
			description: "Type of the field",
		}),
		min: z.coerce.number().nullable().optional().meta({
			description: "Minimum numeric value for the field",
		}),
		max: z.coerce.number().nullable().optional().meta({
			description: "Maximum numeric value for the field",
		}),
		step: z.coerce.number().positive().nullable().optional().meta({
			description: "Step for numeric field controls",
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
