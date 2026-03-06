import { z } from "@hono/zod-openapi";

const ProsConsMcpSchema = z.array(z.string().max(72)).max(5);

export const DraftCreateMcpSchema = z
	.object({
		price: z
			.number()
			.optional()
			.describe(
				"Draft price. Optional at create time because draft creation can be partial.",
			),
		priceType: z
			.enum([
				"closed",
				"open",
			])
			.optional()
			.describe("Draft price mode. Use zbav://mcp/schema/enum/listing-price."),
		condition: z
			.number()
			.optional()
			.describe("Draft condition score as a 0-based index. Optional until publish time."),
		age: z
			.number()
			.optional()
			.describe("Draft age score as a 0-based index. Optional until publish time."),
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
			.describe(
				"Delivery methods planned for the future listing. Use zbav://mcp/schema/enum/listing-delivery.",
			),
		warranty: z
			.enum([
				"warranty",
				"no-warranty",
				"custom",
			])
			.nullable()
			.optional()
			.describe("Draft warranty mode. Use zbav://mcp/schema/enum/listing-warranty."),
		restriction: z
			.enum([
				"none",
				"adult-relaxed",
				"adult",
				"sensitive",
				"restricted",
			])
			.nullable()
			.optional()
			.describe("Draft content restriction. Use zbav://mcp/schema/enum/listing-restriction."),
		locationId: z
			.string()
			.optional()
			.describe(
				"Resolved location id for the draft. Usually comes from session.locationAutocomplete.",
			),
		categoryId: z
			.string()
			.optional()
			.describe(
				"Chosen category id for the draft. Usually comes from session.categoryCollection.",
			),
		expiresAt: z
			.enum([
				"7-days",
				"14-days",
				"1-month",
			])
			.optional()
			.describe(
				"Planned publish expiration preset. Use zbav://mcp/schema/enum/listing-expire.",
			),
		title: z
			.string()
			.min(5)
			.max(72)
			.optional()
			.describe("Seller draft title. Optional while the draft is still incomplete."),
		description: z
			.string()
			.max(2048)
			.optional()
			.describe("Seller draft description. Optional while the draft is still incomplete."),
		pros: ProsConsMcpSchema.nullable()
			.optional()
			.describe("Short list of selling points, up to 5 items."),
		cons: ProsConsMcpSchema.nullable()
			.optional()
			.describe("Short list of drawbacks, up to 5 items."),
		uploadIds: z
			.array(z.string())
			.optional()
			.describe("Optional initial upload ids to attach immediately to the draft gallery."),
	})
	.describe(
		"Seller draft create payload. Drafts can be created complete in one call or incrementally with later patch calls.",
	);

export type DraftCreateMcpSchema = typeof DraftCreateMcpSchema;

export namespace DraftCreateMcpSchema {
	export type Type = z.infer<DraftCreateMcpSchema>;
}
