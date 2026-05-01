import { z } from "zod";

export const FieldTypeEnumSchema = z
	.enum([
		"number",
		"decimal",
		"year",
		"range",
		"text",
		"enum-single",
		"enum-multi",
	])
	.meta({
		id: "FieldTypeEnum",
		description: "Type of a field",
	});

export type FieldTypeEnumSchema = typeof FieldTypeEnumSchema;

export namespace FieldTypeEnumSchema {
	export type Type = z.infer<FieldTypeEnumSchema>;
}
