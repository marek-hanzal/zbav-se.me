import { z } from "zod";
import { CategoryFilterSchema } from "./CategoryFilterSchema";

export const CategoryToolFilterSchema = z
	.looseObject({
		...CategoryFilterSchema.shape,
	})
	.omit({
		idIn: true,
		localeIn: true,
	})
	.strip();

export type CategoryToolFilterSchema = typeof CategoryToolFilterSchema;

export namespace CategoryToolFilterSchema {
	export type Type = z.infer<CategoryToolFilterSchema>;
}
