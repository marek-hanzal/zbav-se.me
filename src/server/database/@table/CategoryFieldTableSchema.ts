import { z } from "zod";
import { FieldKindEnumSchema } from "~/user/field/server/schema/FieldKindEnumSchema";

export const CategoryFieldTableSchema = z
	.looseObject({
		categoryId: z.string().min(1),
		fieldId: z.string().min(1),
		sort: z.number(),
		kind: FieldKindEnumSchema,
	})
	.strip();

export type CategoryFieldTableSchema = typeof CategoryFieldTableSchema;

export namespace CategoryFieldTableSchema {
	export type Type = z.infer<CategoryFieldTableSchema>;
}
