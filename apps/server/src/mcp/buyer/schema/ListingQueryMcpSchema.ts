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

const ListingSortFieldEnumSchema = z.enum([
	"price",
	"condition",
	"age",
	"createdAt",
	"updatedAt",
	"expiresAt",
	"geo",
]);

const OrderEnumSchema = z.enum([
	"asc",
	"desc",
]);

const ScoreSchema = z.number().min(0).max(6);
const IdSchema = z.string();
const NonEmptyIdSchema = z.string().min(1);

const CursorSchema = z
	.object({
		page: z
			.number()
			.min(0)
			.describe("Zero-based result page. See zbav://mcp/field/cursor.page."),
		size: z
			.number()
			.min(1)
			.max(1000)
			.describe("Maximum number of results requested. See zbav://mcp/field/cursor.size."),
	})
	.describe("Pagination cursor for browse-style queries.");

const FilterSchema = z
	.object({
		id: IdSchema.describe(
			"Match one exact listing id. See zbav://mcp/field/filter.id.",
		).optional(),
		idIn: z
			.array(IdSchema)
			.describe("Match any of the provided listing ids. See zbav://mcp/field/filter.idIn.")
			.optional(),
		fulltext: z
			.string()
			.describe(
				"Buyer-facing fulltext search over listing content. See zbav://mcp/field/filter.fulltext.",
			)
			.optional(),
		userId: IdSchema.describe(
			"Limit results to listings owned by one user. See zbav://mcp/field/filter.userId.",
		).optional(),
		priceMin: z
			.number()
			.min(0)
			.describe("Minimum listing price. See zbav://mcp/field/filter.priceMin.")
			.optional(),
		priceMax: z
			.number()
			.min(0)
			.describe("Maximum listing price. See zbav://mcp/field/filter.priceMax.")
			.optional(),
		conditionMin: ScoreSchema.describe(
			"Minimum condition score. See zbav://mcp/field/filter.conditionMin.",
		).optional(),
		conditionMax: ScoreSchema.describe(
			"Maximum condition score. See zbav://mcp/field/filter.conditionMax.",
		).optional(),
		conditionIn: z
			.array(ScoreSchema)
			.describe("Allowed condition scores. See zbav://mcp/field/filter.conditionIn.")
			.optional(),
		ageMin: ScoreSchema.describe(
			"Minimum age score. See zbav://mcp/field/filter.ageMin.",
		).optional(),
		ageMax: ScoreSchema.describe(
			"Maximum age score. See zbav://mcp/field/filter.ageMax.",
		).optional(),
		ageIn: z
			.array(ScoreSchema)
			.describe("Allowed age scores. See zbav://mcp/field/filter.ageIn.")
			.optional(),
		deliveryIn: z
			.array(ListingDeliveryEnumSchema)
			.describe(
				"Allowed delivery methods. See zbav://mcp/schema/enum/listing-delivery and zbav://mcp/field/filter.deliveryIn.",
			)
			.optional(),
		warrantyIn: z
			.array(ListingWarrantyEnumSchema)
			.describe(
				"Allowed warranty modes. See zbav://mcp/schema/enum/listing-warranty and zbav://mcp/field/filter.warrantyIn.",
			)
			.optional(),
		categoryId: NonEmptyIdSchema.describe(
			"Match one category. See zbav://mcp/field/filter.categoryId.",
		).optional(),
		categoryIdIn: z
			.array(NonEmptyIdSchema)
			.describe(
				"Match any of the provided categories. See zbav://mcp/field/filter.categoryIdIn.",
			)
			.optional(),
		currency: CurrencyEnumSchema.describe(
			"One price currency. See zbav://mcp/schema/enum/currency and zbav://mcp/field/filter.currency.",
		).optional(),
		currencyIn: z
			.array(CurrencyEnumSchema)
			.describe(
				"Allowed currencies. See zbav://mcp/schema/enum/currency and zbav://mcp/field/filter.currencyIn.",
			)
			.optional(),
		expiresAtBefore: z
			.string()
			.describe(
				"Match listings that expire before the provided ISO 8601 timestamp. See zbav://mcp/field/filter.expiresAtBefore.",
			)
			.optional(),
		expiresAtAfter: z
			.string()
			.describe(
				"Match listings that expire after the provided ISO 8601 timestamp. See zbav://mcp/field/filter.expiresAtAfter.",
			)
			.optional(),
		range: z
			.number()
			.min(0)
			.describe(
				"Maximum geo distance in kilometers when meta.latLon is available. See zbav://mcp/field/filter.range.",
			)
			.optional(),
		title: z
			.string()
			.describe("Match listing title text. See zbav://mcp/field/filter.title.")
			.optional(),
		withOwn: z
			.boolean()
			.describe(
				"Include listings owned by the current authenticated user. See zbav://mcp/field/filter.withOwn.",
			)
			.optional(),
		my: z
			.boolean()
			.describe("Match listings by whether they belong to the current authenticated user.")
			.optional(),
		withIgnored: z
			.boolean()
			.describe(
				"Include listings ignored by the current authenticated user. See zbav://mcp/field/filter.withIgnored.",
			)
			.optional(),
		isFavourite: z
			.boolean()
			.describe(
				"Match listings by favourite state for the current authenticated user. See zbav://mcp/field/filter.isFavourite.",
			)
			.optional(),
		feedId: NonEmptyIdSchema.describe(
			"Match one feed id when browsing a feed-driven surface. See zbav://mcp/field/filter.feedId.",
		).optional(),
		feedIdIn: z
			.array(NonEmptyIdSchema)
			.describe("Match any of the provided feed ids. See zbav://mcp/field/filter.feedIdIn.")
			.optional(),
		transaction: z
			.boolean()
			.describe(
				"Match listings by whether the current authenticated user has a related transaction. See zbav://mcp/field/filter.transaction.",
			)
			.optional(),
	})
	.describe(
		"Primary buyer filter block. Use this public MCP filter for exact ids, fulltext, category, price, geo range, favourite state, and other buyer-facing constraints.",
	);

const SortItemSchema = z
	.object({
		field: ListingSortFieldEnumSchema.describe(
			"Field used for sorting. See zbav://mcp/schema/enum/listing-sort and zbav://mcp/field/sort.field.",
		),
		order: OrderEnumSchema.describe(
			"Sort direction. See zbav://mcp/schema/enum/listing-sort and zbav://mcp/field/sort.order.",
		),
	})
	.describe("One sort instruction with field and order.");

const MetaSchema = z
	.object({
		latLon: z
			.object({
				lat: z.number().min(-90).max(90).describe("Latitude in decimal degrees."),
				lon: z.number().min(-180).max(180).describe("Longitude in decimal degrees."),
			})
			.describe(
				"Latitude and longitude for distance-aware buyer queries. See zbav://mcp/field/meta.latLon.",
			)
			.optional(),
		feedId: NonEmptyIdSchema.describe(
			"Feed context for feed-driven buyer surfaces. See zbav://mcp/field/meta.feedId.",
		).optional(),
	})
	.describe(
		"Optional execution context for the query, such as buyer geolocation for distance-aware results.",
	);

export const ListingQueryMcpSchema = z
	.object({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		filter: FilterSchema.optional(),
		sort: z
			.array(SortItemSchema)
			.describe(
				"Sort instructions applied in order. See zbav://mcp/schema/enum/listing-sort.",
			)
			.optional(),
		meta: MetaSchema.optional(),
	})
	.describe(
		"Buyer listing query for MCP. Use filter for public buyer-facing constraints, sort for ordering, and meta for execution context such as geolocation.",
	);

export type ListingQueryMcpSchema = typeof ListingQueryMcpSchema;

export namespace ListingQueryMcpSchema {
	export type Type = z.infer<ListingQueryMcpSchema>;
}
