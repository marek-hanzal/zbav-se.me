import { z } from "@hono/zod-openapi";
import { ListingFlagDbSchema } from "./ListingFlagDbSchema";

export const ListingFlagSchema = z
	.object({
		...ListingFlagDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("ListingFlag");

export type ListingFlagSchema = typeof ListingFlagSchema;

export namespace ListingFlagSchema {
	export type Type = z.infer<ListingFlagSchema>;
}
