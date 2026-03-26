import { z } from "@hono/zod-openapi";
import { DefaultFilterSchema } from "~/common/schema/DefaultFilterSchema";

export const ListingFilterSchema = z
	.looseObject({
		...DefaultFilterSchema.shape,
		userId: z.string().optional().openapi({
			description: "ID of the user; does not have an effect on API endpoints",
		}),
	})
	.strip()
	.openapi("ListingFilter", {
		description: "User-land filters",
	});

export type ListingFilterSchema = typeof ListingFilterSchema;

export namespace ListingFilterSchema {
	export type Type = z.infer<ListingFilterSchema>;
}
