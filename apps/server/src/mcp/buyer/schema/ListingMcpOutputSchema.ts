import { z } from "@hono/zod-openapi";

const CurrencyEnumSchema = z.enum([
	"CZK",
	"EUR",
	"USD",
	"GBP",
	"PLN",
	"HUF",
	"CHF",
]);

const ListingPriceEnumSchema = z.enum([
	"closed",
	"open",
]);

const ListingRestrictionEnumSchema = z.enum([
	"none",
	"adult-relaxed",
	"adult",
	"sensitive",
	"restricted",
]);

const ListingDeliveryEnumSchema = z.enum([
	"personal",
	"post",
	"package",
	"other",
]);

const ListingWarrantyEnumSchema = z.enum([
	"warranty",
	"no-warranty",
	"custom",
]);

const ThumbEnumSchema = z.enum([
	"like",
	"dislike",
]);

const DateTimeStringSchema = z.iso.datetime();

const NullableStringSchema = z.string().nullable();
const NullableNumberSchema = z.number().nullable();
const NullableStringArraySchema = z.array(z.string().max(72)).max(5).nullable();
const NullableDeliverySchema = z.array(ListingDeliveryEnumSchema).nullable();
const NullableWarrantySchema = ListingWarrantyEnumSchema.nullable();
const NullableThumbSchema = ThumbEnumSchema.nullable();

const UploadMcpSchema = z
	.object({
		id: z.string().describe("Unique upload id."),
		url: z.url().describe("Public URL of the uploaded image."),
	})
	.describe("One uploaded image referenced from a gallery item.");

const GalleryItemMcpSchema = z
	.object({
		id: z.string().describe("Unique gallery item id."),
		galleryId: z.string().describe("Owning gallery id."),
		uploadId: z.string().describe("Referenced upload id."),
		sort: z.number().describe("Ordering position within the gallery."),
		upload: UploadMcpSchema.describe("Resolved uploaded image for this gallery item."),
	})
	.describe("One ordered image entry inside the listing gallery.");

const GalleryMcpSchema = z
	.object({
		id: z.string().describe("Unique gallery id."),
		items: z.array(GalleryItemMcpSchema).describe("Ordered gallery items for the listing."),
	})
	.describe(
		"Gallery attached to the listing. This is the canonical place to inspect listing photos.",
	);

const CategoryMcpSchema = z
	.object({
		id: z.string().describe("Unique category id."),
		group: z.string().describe("Higher-level category group."),
		category: z.string().describe("Buyer-visible category name."),
		slug: z.string().describe("Stable category slug."),
		sort: z.number().describe("Category sort position."),
		locale: z.string().describe("Locale used for category naming."),
	})
	.describe("Resolved category attached to the listing.");

const LocationMcpSchema = z
	.object({
		id: z.string().describe("Unique location id."),
		query: z.string().describe("Original location query or label."),
		lang: z.string().describe("Locale used for the location."),
		country: z.string().describe("Resolved country name."),
		code: z.string().describe("Resolved country or location code."),
		county: NullableStringSchema.describe("Resolved county, or null when unavailable."),
		municipality: NullableStringSchema.describe(
			"Resolved municipality, or null when unavailable.",
		),
		state: NullableStringSchema.describe("Resolved state or region, or null when unavailable."),
		address: z.string().describe("Resolved display address."),
		city: NullableStringSchema.describe("Resolved city, or null when unavailable."),
		street: NullableStringSchema.describe("Resolved street, or null when unavailable."),
		zip: NullableStringSchema.describe("Resolved postal code, or null when unavailable."),
		confidence: z.number().describe("Geocoding confidence score."),
		hash: z.string().describe("Stable location hash."),
		lat: z.number().describe("Latitude in decimal degrees."),
		lon: z.number().describe("Longitude in decimal degrees."),
	})
	.describe("Resolved marketplace location attached to the listing.");

export const ListingMcpOutputSchema = z
	.object({
		id: z.string().describe("Unique listing id."),
		price: z.number().describe("Listing price amount."),
		priceType: ListingPriceEnumSchema.describe(
			"Price interpretation mode for the listing. See zbav://mcp/schema/enum/listing-price.",
		),
		currency: CurrencyEnumSchema.describe(
			"Currency code used by the listing price. See zbav://mcp/schema/enum/currency.",
		),
		condition: NullableNumberSchema.describe(
			"Condition score for the listing, or null when unavailable.",
		),
		age: NullableNumberSchema.describe("Age score for the listing, or null when unavailable."),
		delivery: NullableDeliverySchema.describe(
			"Supported delivery methods for the listing. See zbav://mcp/schema/enum/listing-delivery.",
		),
		warranty: NullableWarrantySchema.describe(
			"Warranty status for the listing. See zbav://mcp/schema/enum/listing-warranty.",
		),
		restriction: ListingRestrictionEnumSchema.describe(
			"Content restriction level of the listing. See zbav://mcp/schema/enum/listing-restriction.",
		),
		locationId: z.string().describe("Referenced location id."),
		categoryId: z.string().describe("Referenced category id."),
		galleryId: z.string().describe("Referenced gallery id."),
		draftId: NullableStringSchema.describe(
			"Source draft id for this listing, or null when unavailable.",
		),
		expiresAt: DateTimeStringSchema.describe(
			"Listing expiration timestamp in ISO 8601 format.",
		),
		title: z.string().describe("Buyer-visible listing title."),
		description: NullableStringSchema.describe(
			"Buyer-visible listing description, or null when absent.",
		),
		pros: NullableStringArraySchema.describe(
			"Short positive bullet points for the listing, or null when absent.",
		),
		cons: NullableStringArraySchema.describe(
			"Short negative bullet points for the listing, or null when absent.",
		),
		createdAt: DateTimeStringSchema.describe("Listing creation timestamp in ISO 8601 format."),
		updatedAt: DateTimeStringSchema.describe(
			"Listing last update timestamp in ISO 8601 format.",
		),
		location: LocationMcpSchema.describe("Resolved location attached to the listing."),
		category: CategoryMcpSchema.describe("Resolved category attached to the listing."),
		distance: NullableNumberSchema.describe(
			"Distance in kilometers from the query location to the listing, or null when no geo distance applies.",
		),
		gallery: GalleryMcpSchema.describe("Resolved gallery attached to the listing."),
		my: z
			.boolean()
			.describe("True when the listing belongs to the current authenticated user."),
		isFavourite: z
			.boolean()
			.describe("True when the current authenticated user saved this listing to favourites."),
		isIgnored: z
			.boolean()
			.describe("True when the current authenticated user chose to ignore this listing."),
		hasFlag: z
			.boolean()
			.describe("True when the current authenticated user flagged this listing."),
		transactionId: NullableStringSchema.describe(
			"Transaction ID for the current authenticated user's related transaction, or null when no transaction exists.",
		),
		thumb: NullableThumbSchema.describe(
			"Current authenticated user's thumb reaction for this listing. See zbav://mcp/schema/enum/thumb.",
		),
	})
	.strip()
	.describe(
		"One buyer-visible listing formatted for MCP. Date fields are returned as ISO 8601 strings.",
	);

export type ListingMcpOutputSchema = typeof ListingMcpOutputSchema;

export namespace ListingMcpOutputSchema {
	export type Type = z.infer<ListingMcpOutputSchema>;

	export type Source = Omit<Type, "createdAt" | "updatedAt" | "expiresAt"> & {
		createdAt: Date;
		expiresAt: Date;
		updatedAt: Date;
	};
}

export const withListingMcpOutput = (
	listing: ListingMcpOutputSchema.Source,
): ListingMcpOutputSchema.Type => {
	return {
		...listing,
		expiresAt: listing.expiresAt.toISOString(),
		createdAt: listing.createdAt.toISOString(),
		updatedAt: listing.updatedAt.toISOString(),
	};
};
