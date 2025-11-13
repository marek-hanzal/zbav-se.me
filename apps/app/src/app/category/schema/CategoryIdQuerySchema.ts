import z from "zod";

export const CategoryIdQuerySchema = z.object({
	categoryId: z.string(),
});

export type CategoryIdQuerySchema = typeof CategoryIdQuerySchema;

export namespace CategoryIdQuerySchema {
	export type Type = z.infer<CategoryIdQuerySchema>;
}
