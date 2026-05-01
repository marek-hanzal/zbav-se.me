import { z } from "zod";

export const CategoryFieldTableSchema = z
	.looseObject({
		categoryId: z.string().min(1),
		fieldId: z.string().min(1),
		sort: z.number(),
		required: z.boolean().nullable(),
	})
	.strip();

export type CategoryFieldTableSchema = typeof CategoryFieldTableSchema;

export namespace CategoryFieldTableSchema {
	export type Type = z.infer<CategoryFieldTableSchema>;
}
