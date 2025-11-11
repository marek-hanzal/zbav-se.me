import type { z } from "@hono/zod-openapi";
import { ListingIgnoreQuerySchema } from "./ListingIgnoreQuerySchema";

export const ListingIgnoreCountQuerySchema = ListingIgnoreQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("ListingIgnoreCountQuery", {
	description: "Query object for listing ignore count",
});

export type ListingIgnoreCountQuerySchema =
	typeof ListingIgnoreCountQuerySchema;

export namespace ListingIgnoreCountQuerySchema {
	export type Type = z.infer<ListingIgnoreCountQuerySchema>;
}
