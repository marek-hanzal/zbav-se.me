import { z } from "@hono/zod-openapi";
import { ListingCartDbSchema } from "./ListingCartDbSchema";

export const ListingCartSchema = z
	.object({
		...ListingCartDbSchema.shape,
	})
	.omit({
		userId: true,
	})
	.openapi("ListingCart");

export type ListingCartSchema = typeof ListingCartSchema;

export namespace ListingCartSchema {
	export type Type = z.infer<ListingCartSchema>;
}
