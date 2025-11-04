import { z } from "@hono/zod-openapi";

export const CategoryIdSchema = ({
	type = "CategoryId",
	description = "ID of the category",
}: CategoryIdSchema.Props) =>
	z.string().min(1, "Category ID is required").openapi(type, {
		description,
	});

export type CategoryIdSchema = ReturnType<typeof CategoryIdSchema>;

export namespace CategoryIdSchema {
	export interface Props {
		type?: string;
		description?: string;
	}

	export type Type = z.infer<CategoryIdSchema>;
}
