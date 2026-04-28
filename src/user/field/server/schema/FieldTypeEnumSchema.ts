import { z } from "zod";

export const FieldTypeEnumSchema = z
	.enum([
		"number",
		"decimal",
		"text",
		"enum-single",
		"enum-multi",
		"location",
	])
	.meta({
		id: "FieldTypeEnum",
		description: "Type of a field",
	});

export type FieldTypeEnumSchema = typeof FieldTypeEnumSchema;

export namespace FieldTypeEnumSchema {
	export type Type = z.infer<FieldTypeEnumSchema>;
}
