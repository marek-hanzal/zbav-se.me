import { z } from "@hono/zod-openapi";

const ProsConsMcpSchema = z.array(z.string().max(72)).max(5);

const DraftPatchDataMcpSchema = z
	.object({
		price: z.number().nullable().optional(),
		priceType: z
			.enum([
				"closed",
				"open",
			])
			.nullable()
			.optional(),
		condition: z.number().nullable().optional(),
		age: z.number().nullable().optional(),
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
			.optional(),
		warranty: z
			.enum([
				"warranty",
				"no-warranty",
				"custom",
			])
			.nullable()
			.optional(),
		restriction: z
			.enum([
				"none",
				"adult-relaxed",
				"adult",
				"sensitive",
				"restricted",
			])
			.nullable()
			.optional(),
		locationId: z.string().nullable().optional(),
		categoryId: z.string().nullable().optional(),
		expiresAt: z
			.enum([
				"7-days",
				"14-days",
				"1-month",
			])
			.nullable()
			.optional(),
		title: z.string().min(5).max(72).nullable().optional(),
		description: z.string().max(2048).nullable().optional(),
		pros: ProsConsMcpSchema.nullable().optional(),
		cons: ProsConsMcpSchema.nullable().optional(),
	})
	.describe("Partial draft patch. Include only fields that should change.");

export const DraftPatchMcpSchema = z
	.object({
		draftId: z
			.string()
			.describe("Target draft id. Preserve the draft id returned by seller.draftCreate."),
		patch: DraftPatchDataMcpSchema,
	})
	.describe("Seller draft patch payload for progressive draft editing.");

export type DraftPatchMcpSchema = typeof DraftPatchMcpSchema;

export namespace DraftPatchMcpSchema {
	export type Type = z.infer<DraftPatchMcpSchema>;
}
