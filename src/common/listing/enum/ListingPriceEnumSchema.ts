import { z } from "zod";

export const ListingPriceEnumSchema = z
	.enum([
		/**
		 * Fixed price - seller does not accept offers, price is set in stone.
		 */
		"fixed",
		/**
		 * Open price - price is set by the seller, but they are open to offers and
		 * negotiations. Price is expected to be a starting point for negotiations.
		 */
		"haggle",
		/**
		 * Ask price - price is not set by the seller, but they expect buyers to ask for
		 * a price. This is used for listings where the price is expected to be determined
		 * through direct communication between buyer and seller, often for unique or highly
		 * variable items.
		 */
		"ask",
		/**
		 * For free - the item is offered for free, no payment expected. This is used for listings
		 * where the seller is giving away the item without expecting any compensation, often for items
		 * that are still usable but no longer needed by the seller.
		 */
		"free",
		/**
		 * Haul away - the item is offered for free, but the buyer is expected to haul it away
		 * themselves. This is often used for large items that are difficult to transport, where
		 * the seller is willing to give it away but does not want to deal with the logistics of moving it.
		 */
		"haulaway",
	])
	.meta({
		id: "ListingPriceEnum",
		description: "Price type of the listing",
	});

export type ListingPriceEnumSchema = typeof ListingPriceEnumSchema;

export namespace ListingPriceEnumSchema {
	export type Type = z.infer<ListingPriceEnumSchema>;
}
