import { z } from "zod";
import { CategoryTableSchema } from "~/server/database/@table/CategoryTableSchema";

export const CategorySchema = z
	.looseObject({
		...CategoryTableSchema.shape,
	})
	.strip()
	.meta({
		id: "PublicCategory",
		description: "Public category data",
	});

export type CategorySchema = typeof CategorySchema;

export namespace CategorySchema {
	export type Type = z.infer<CategorySchema>;
}
