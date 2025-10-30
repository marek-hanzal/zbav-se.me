import { z } from "@hono/zod-openapi";
import { CategoryIdSchema } from "./CategoryIdSchema";

export const CategoryIdInSchema = ({
	type = "CategoryIdIn",
	description = "Provides an array of categories",
}: CategoryIdInSchema.Props) =>
	z.array(CategoryIdSchema({})).openapi(type, {
		description,
	});

export namespace CategoryIdInSchema {
	export interface Props {
		type?: string;
		description?: string;
	}
}
