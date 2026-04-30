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
