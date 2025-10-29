import z from "zod";
import { CategorySchema } from "./CategorySchema";

export const CategoryDtoSchema = z
	.object({
		...CategorySchema.shape,
	})
	.openapi("CategoryDto", {
		description: "Category data transfer object",
	});

export type CategoryDtoSchema = typeof CategoryDtoSchema;

export namespace CategoryDtoSchema {
	export type Type = z.infer<CategoryDtoSchema>;
}
