import { z } from "@hono/zod-openapi";
import type { ListingTransactionEventEnumSchema } from "~/app/listing-transaction/schema/ListingTransactionEventEnumSchema";
import { ListingTransactionLocationDbSchema } from "~/app/listing-transaction-location/schema/ListingTransactionLocationDbSchema";

export const ListingTransactionLocationSchema = z
	.object({
		...ListingTransactionLocationDbSchema.shape,
		event: z.literal("location" satisfies ListingTransactionEventEnumSchema.Type).openapi({
			description: "Event type",
		}),
	})
	.omit({
		createdAt: true,
	})
	.openapi("ListingTransactionLocation", {
		description: "Listing transaction location entry",
	});

export type ListingTransactionLocationSchema = typeof ListingTransactionLocationSchema;

export namespace ListingTransactionLocationSchema {
	export type Type = z.infer<ListingTransactionLocationSchema>;
}
