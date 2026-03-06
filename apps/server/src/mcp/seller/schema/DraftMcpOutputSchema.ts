import { z } from "@hono/zod-openapi";
import { CategoryMcpOutputSchema } from "~/mcp/session/schema/CategoryMcpOutputSchema";
import { LocationMcpOutputSchema } from "~/mcp/session/schema/LocationMcpOutputSchema";
import { GalleryMcpOutputSchema } from "~/mcp/user/schema/GalleryMcpOutputSchema";

const NullableStringSchema = z.string().nullable();
const NullableNumberSchema = z.number().nullable();
const ProsConsMcpSchema = z.array(z.string().max(72)).max(5).nullable();

export const DraftMcpOutputSchema = z
	.object({
		id: z
			.string()
			.describe(
				"Stable draft id. Preserve this id for later patch, gallery, and publish steps.",
			),
		price: NullableNumberSchema.describe("Draft price, or null when not filled yet."),
		priceType: z
			.enum([
				"closed",
				"open",
			])
			.nullable()
			.describe("Draft price mode, or null when not filled yet."),
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
			.nullable()
			.describe("Draft currency. Current create flow defaults to CZK."),
		condition: NullableNumberSchema.describe(
			"Draft condition score, or null when not filled yet.",
		),
		age: NullableNumberSchema.describe("Draft age score, or null when not filled yet."),
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
			.describe("Draft delivery methods, or null when not filled yet."),
		warranty: z
			.enum([
				"warranty",
				"no-warranty",
				"custom",
			])
			.nullable()
			.describe("Draft warranty mode, or null when not filled yet."),
		restriction: z
			.enum([
				"none",
				"adult-relaxed",
				"adult",
				"sensitive",
				"restricted",
			])
			.nullable()
			.describe("Draft content restriction, or null when not filled yet."),
		locationId: NullableStringSchema.describe(
			"Location id attached to the draft, or null when not chosen yet.",
		),
		categoryId: NullableStringSchema.describe(
			"Category id attached to the draft, or null when not chosen yet.",
		),
		galleryId: z
			.string()
			.describe(
				"Gallery id owned by the draft. The gallery always exists once the draft exists.",
			),
		expiresAt: z
			.enum([
				"7-days",
				"14-days",
				"1-month",
			])
			.nullable()
			.describe("Draft expiration preset, or null when not filled yet."),
		title: NullableStringSchema.describe("Draft title, or null when not filled yet."),
		description: NullableStringSchema.describe(
			"Draft description, or null when not filled yet.",
		),
		pros: ProsConsMcpSchema.describe("Draft pros, or null when not filled yet."),
		cons: ProsConsMcpSchema.describe("Draft cons, or null when not filled yet."),
		createdAt: z.string().describe("Draft creation timestamp as ISO 8601 string."),
		updatedAt: z.string().describe("Draft last update timestamp as ISO 8601 string."),
		usedAt: z
			.string()
			.nullable()
			.describe(
				"Timestamp when the draft was already used to create a listing, or null when still unpublished.",
			),
		location: LocationMcpOutputSchema.nullable().describe(
			"Expanded resolved location for the draft, or null when location is not set.",
		),
		category: CategoryMcpOutputSchema.nullable().describe(
			"Expanded resolved category for the draft, or null when category is not set.",
		),
		gallery: GalleryMcpOutputSchema.describe(
			"Expanded draft gallery with upload-backed items.",
		),
	})
	.describe("Seller draft output used in draft creation and patch workflows.");

export type DraftMcpOutputSchema = typeof DraftMcpOutputSchema;

export namespace DraftMcpOutputSchema {
	export type Type = z.infer<DraftMcpOutputSchema>;
}

export const withDraftMcpOutput = (draft: Record<string, unknown>): DraftMcpOutputSchema.Type => {
	const withDate = (value: unknown): string | null => {
		if (value instanceof Date) {
			return value.toISOString();
		}

		if (typeof value === "string") {
			return value;
		}

		return null;
	};

	const withNullableRecord = (value: unknown) => {
		return value && typeof value === "object" && !Array.isArray(value)
			? (value as Record<string, unknown>)
			: null;
	};

	const gallery = withNullableRecord(draft.gallery) ?? {
		id: "",
		items: [],
	};

	return {
		...(draft as unknown as Omit<
			DraftMcpOutputSchema.Type,
			"createdAt" | "updatedAt" | "usedAt" | "gallery" | "location" | "category"
		>),
		createdAt: withDate(draft.createdAt) ?? "",
		updatedAt: withDate(draft.updatedAt) ?? "",
		usedAt: withDate(draft.usedAt),
		location: withNullableRecord(draft.location) as DraftMcpOutputSchema.Type["location"],
		category: withNullableRecord(draft.category) as DraftMcpOutputSchema.Type["category"],
		gallery: gallery as DraftMcpOutputSchema.Type["gallery"],
	};
};
