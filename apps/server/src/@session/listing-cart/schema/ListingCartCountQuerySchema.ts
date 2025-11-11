import type { z } from "@hono/zod-openapi";
import { ListingCartQuerySchema } from "./ListingCartQuerySchema";

export const ListingCartCountQuerySchema = ListingCartQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("ListingCartCountQuery", {
	description: "Query object for listing cart count",
});

export type ListingCartCountQuerySchema = typeof ListingCartCountQuerySchema;

export namespace ListingCartCountQuerySchema {
	export type Type = z.infer<ListingCartCountQuerySchema>;
}
