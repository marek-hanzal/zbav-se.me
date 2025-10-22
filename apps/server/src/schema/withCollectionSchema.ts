import { z } from "@hono/zod-openapi";
export namespace withCollectionSchema {
	export type Props<T extends z.ZodTypeAny> = {
		schema: T;
		type: string;
		description: string;
	};
}

/**
 * Generic factory method for creating collection schemas
 * @param schema - The schema for individual items in the collection
 * @param type - The OpenAPI type name for the collection
 * @param description - The OpenAPI description for the collection
 * @returns A collection schema with data array and more boolean
 */
export function withCollectionSchema<T extends z.ZodTypeAny>({
	schema,
	type,
	description,
}: withCollectionSchema.Props<T>) {
	return z
		.object({
			data: z.array(schema),
			more: z.boolean().openapi({
				description: "Whether there are more items to fetch",
			}),
		})
		.openapi(type, {
			description,
		});
}
