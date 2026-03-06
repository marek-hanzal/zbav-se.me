import { z } from "@hono/zod-openapi";
import { CategoryMcpOutputSchema } from "~/mcp/session/schema/CategoryMcpOutputSchema";
import { LocationMcpOutputSchema } from "~/mcp/session/schema/LocationMcpOutputSchema";
import { GalleryMcpOutputSchema } from "~/mcp/user/schema/GalleryMcpOutputSchema";

const NullableStringSchema = z.string().nullable();
const NullableNumberSchema = z.number().nullable();
const ProsConsMcpSchema = z.array(z.string().max(72)).max(5).nullable();

export const SellerListingMcpOutputSchema = z
	.object({
		id: z.string().describe("Stable published listing id."),
		price: z.number().describe("Published listing price."),
		priceType: z
			.enum([
				"closed",
				"open",
			])
			.describe("Published listing price mode."),
		currency: z
			.enum([
				"CZK",
				"EUR",
				"USD",
				"GBP",
				"PLN",
				"HUF",
				"CHF",
			])
			.describe("Published listing currency."),
		condition: NullableNumberSchema.describe(
			"Published listing condition score, or null when intentionally unset.",
		),
		age: NullableNumberSchema.describe(
			"Published listing age score, or null when intentionally unset.",
		),
		delivery: z
			.array(
				z.enum([
					"personal",
					"post",
					"package",
					"other",
				]),
			)
			.nullable()
			.describe("Published delivery methods, or null when unset."),
		warranty: z
			.enum([
				"warranty",
				"no-warranty",
				"custom",
			])
			.nullable()
			.describe("Published warranty mode, or null when unset."),
		restriction: z
			.enum([
				"none",
				"adult-relaxed",
				"adult",
				"sensitive",
				"restricted",
			])
			.describe("Published content restriction level."),
		locationId: z.string().describe("Published location id."),
		categoryId: z.string().describe("Published category id."),
		galleryId: z.string().describe("Published gallery id."),
		expiresAt: z.string().describe("Publish expiration timestamp as ISO 8601 string."),
		title: z.string().describe("Published listing title."),
		description: NullableStringSchema.describe(
			"Published description, or null when not present.",
		),
		pros: ProsConsMcpSchema.describe("Published pros, or null when absent."),
		cons: ProsConsMcpSchema.describe("Published cons, or null when absent."),
		createdAt: z.string().describe("Listing creation timestamp as ISO 8601 string."),
		updatedAt: z.string().describe("Listing last update timestamp as ISO 8601 string."),
		draftId: NullableStringSchema.describe(
			"Source draft id, or null when the listing was not linked back to a draft.",
		),
		location: LocationMcpOutputSchema.describe("Expanded published location."),
		category: CategoryMcpOutputSchema.describe("Expanded published category."),
		gallery: GalleryMcpOutputSchema.describe(
			"Expanded published gallery with upload-backed items.",
		),
	})
	.describe("Seller listing output returned after publish.");

export type SellerListingMcpOutputSchema = typeof SellerListingMcpOutputSchema;

export namespace SellerListingMcpOutputSchema {
	export type Type = z.infer<SellerListingMcpOutputSchema>;
}

export const withSellerListingMcpOutput = (
	listing: Record<string, unknown>,
): SellerListingMcpOutputSchema.Type => {
	const withDate = (value: unknown): string => {
		if (value instanceof Date) {
			return value.toISOString();
		}

		return typeof value === "string" ? value : "";
	};

	const withNullableDate = (value: unknown): string | null => {
		if (value instanceof Date) {
			return value.toISOString();
		}

		return typeof value === "string" ? value : null;
	};

	return {
		...(listing as unknown as Omit<
			SellerListingMcpOutputSchema.Type,
			"createdAt" | "updatedAt" | "expiresAt" | "draftId"
		>),
		createdAt: withDate(listing.createdAt),
		updatedAt: withDate(listing.updatedAt),
		expiresAt: withDate(listing.expiresAt),
		draftId:
			withNullableDate(undefined) ??
			(typeof listing.draftId === "string" ? listing.draftId : null),
	};
};
