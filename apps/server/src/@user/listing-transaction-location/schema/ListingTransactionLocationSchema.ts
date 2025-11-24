import { z } from "@hono/zod-openapi";
import { ListingTransactionLocationDbSchema } from "~/app/listing-transaction-location/schema/ListingTransactionLocationDbSchema";

export const ListingTransactionLocationSchema = z
	.object({
		...ListingTransactionLocationDbSchema.shape,
	})
	.openapi("ListingTransactionLocation", {
		description: "Listing transaction location entry",
	})
	.omit({
		createdAt: true,
	});

export type ListingTransactionLocationSchema = typeof ListingTransactionLocationSchema;

export namespace ListingTransactionLocationSchema {
	export type Type = z.infer<ListingTransactionLocationSchema>;
}
