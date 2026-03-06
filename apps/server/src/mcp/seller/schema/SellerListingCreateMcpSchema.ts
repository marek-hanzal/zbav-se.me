import { z } from "@hono/zod-openapi";

const ProsConsMcpSchema = z.array(z.string().max(72)).max(5);

export const SellerListingCreateMcpSchema = z
	.object({
		price: z.number().describe("Required listing price."),
		priceType: z
			.enum([
				"closed",
				"open",
			])
			.describe("Required listing price mode. Use zbav://mcp/schema/enum/listing-price."),
		condition: z
			.number()
			.nullable()
			.describe(
				"Required condition field. Null is allowed when the listing intentionally has no condition score.",
			),
		age: z
			.number()
			.nullable()
			.describe(
				"Required age field. Null is allowed when the listing intentionally has no age score.",
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
			.optional()
			.describe("Optional delivery methods for the listing."),
		warranty: z
			.enum([
				"warranty",
				"no-warranty",
				"custom",
			])
			.nullable()
			.optional()
			.describe("Optional warranty mode."),
		restriction: z
			.enum([
				"none",
				"adult-relaxed",
				"adult",
				"sensitive",
				"restricted",
			])
			.describe("Required content restriction level."),
		draftId: z
			.string()
			.optional()
			.describe(
				"Source draft id. Use this when publishing from an existing draft so the draft gets marked as used.",
			),
		locationId: z.string().describe("Required location id."),
		categoryId: z.string().describe("Required category id."),
		expiresAt: z
			.enum([
				"7-days",
				"14-days",
				"1-month",
			])
			.describe("Required expiration preset."),
		title: z.string().min(5).max(72).describe("Required listing title."),
		description: z
			.string()
			.max(2048)
			.nullable()
			.optional()
			.describe("Optional listing description."),
		pros: ProsConsMcpSchema.nullable().optional().describe("Optional list of pros."),
		cons: ProsConsMcpSchema.nullable().optional().describe("Optional list of cons."),
		uploadIds: z
			.array(z.string())
			.min(1)
			.describe(
				"Required upload ids for the listing gallery. At least one image is required.",
			),
	})
	.describe(
		"Seller listing create payload. This is the publish step that creates a public listing, optionally from a draft.",
	);

export type SellerListingCreateMcpSchema = typeof SellerListingCreateMcpSchema;

export namespace SellerListingCreateMcpSchema {
	export type Type = z.infer<SellerListingCreateMcpSchema>;
}
