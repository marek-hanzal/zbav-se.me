import { z } from "zod";

const SellerEnumSchema = z.enum([
	/**
	 * How many listing a user can created (include drafts)
	 */
	"seller:limit:listing.count",
	/**
	 * How many gallery items may a user attach to the listing (draft)
	 */
	"seller:limit:listing.gallery.count",
	/**
	 * By default, listings are delivered to non-paying buyers with delay, this perk
	 * enables seller to distribute their listings to _all_ users in time.
	 *
	 * This is very strong feature which should be only in high-end packages/top package.
	 */
	"seller:feature:listing.early-delivery",
	/**
	 * This is consumable item - seller selects, which listing he marks with early delivery.
	 */
	"seller:item:listing.early-delivery",
	/**
	 * Enables access to more deep buyer analysis data.
	 */
	"seller:feature:buyer.info",
    /**
     * Cheap way to mark a listing; does not affect ordering, it's only like "heeey, I'm here!".
     *
     * Could be suppresed by buyer's anti-topper.
     */
	"seller:item:listing.mark",
    /**
     * This is classic Top, but it could be suppresed by buyers' anti-topper.
     */
	"seller:item:listing.top",
    /**
     * High-tech top: this one cannot be suppresed by buyer: keep sort and listing status. Basically a 
     * bullet which cannot be dodged.
     */
	"seller:item:listing.top-maxi",
]);

const BuyerEnumSchema = z.enum([
	/**
	 * How many feeds a user can have
	 */
	"buyer:limit:feed.count",
	/**
	 * Buyer-side counter-part for sellers' early-delivery.
	 *
	 * This per enables buyers to discover all the listings in the feed early; does not effect
	 * direct links which are enabled all the times.
	 */
	"buyer:feature:listing.early-discovery",
	/**
	 * Early Diescovery
	 *
	 * This enables users to _discover_ listings early before others; basically it removes
	 * synthetic availableAt in the future on listings.
	 */
	"buyer:limit:early-discovery",
	/**
	 * Enables access to more deep seller analysis data.
	 */
	"buyer:feature:seller.info",
	/**
	 * This will suppress Marks and simple Tops; Top-Maxxi will survive this feature.
	 */
	"buyer:feature:anti-topper",
]);

const CommonEnumSchema = z.enum([
	/**
	 * Those are token packages
	 */
	"common:item:token-small",
	"common:item:token-medium",
	"common:item:token-large",
]);

export const ResourceDefinitionEnumSchema = z
	.enum([
		...SellerEnumSchema.options,
		...BuyerEnumSchema.options,
		...CommonEnumSchema.options,
	])
	.meta({
		id: "ResourceDefinitionEnum",
		description: "Supported resource definitions.",
	});

export type ResourceDefinitionEnumSchema = typeof ResourceDefinitionEnumSchema;

export namespace ResourceDefinitionEnumSchema {
	export type Type = z.infer<ResourceDefinitionEnumSchema>;
}
