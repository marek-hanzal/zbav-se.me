import { z } from "@hono/zod-openapi";
import { ListingIgnoreDbSchema } from "./ListingIgnoreDbSchema";

export const ListingIgnoreSchema = z
	.object({
		...ListingIgnoreDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("ListingIgnore");

export type ListingIgnoreSchema = typeof ListingIgnoreSchema;

export namespace ListingIgnoreSchema {
	export type Type = z.infer<ListingIgnoreSchema>;
}
