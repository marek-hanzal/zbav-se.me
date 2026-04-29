import { z } from "zod";
import { FieldTypeEnumSchema } from "~/user/field/server/schema/FieldTypeEnumSchema";
import { FieldOptionSchema } from "~/user/field-option/server/schema/FieldOptionSchema";

export const CategoryFieldSchema = z
	.looseObject({
		name: z.string().min(1),
		type: FieldTypeEnumSchema,
		required: z.boolean(),
		options: z.array(FieldOptionSchema),
	})
	.strip();

export type CategoryFieldSchema = typeof CategoryFieldSchema;

export namespace CategoryFieldSchema {
	export type Type = z.infer<CategoryFieldSchema>;
}
