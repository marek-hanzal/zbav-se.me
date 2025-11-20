import { z } from "@hono/zod-openapi";
import { ListingIgnoreDbSchema } from "../../../app/listing-ignore/schema/ListingIgnoreDbSchema";

export const ListingIgnoreSchema = z
	.object({
		...ListingIgnoreDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("ListingIgnore", {
		description: "Listing ignore data",
	});

export type ListingIgnoreSchema = typeof ListingIgnoreSchema;

export namespace ListingIgnoreSchema {
	export type Type = z.infer<ListingIgnoreSchema>;
}
