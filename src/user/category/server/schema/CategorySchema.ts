import { z } from "zod";
import { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";

export const CategorySchema = z
	.looseObject({
		...CategoryTableSchema.shape,
		isRestricted: z.boolean(),
	})
	.strip()
	.meta({
		id: "Category",
		description: "Category data",
	});

export type CategorySchema = typeof CategorySchema;

export namespace CategorySchema {
	export type Type = z.infer<CategorySchema>;
}
