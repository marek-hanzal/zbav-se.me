import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import type { StaticResourceDocument } from "~/mcp/resource/static/StaticResourceDocument";
import { withStaticResourceDefinition } from "~/mcp/resource/static/withStaticResourceDefinition";

interface StaticResourceEntry {
	documentPath: string;
	staticUrl: string;
	uri: string;
}

const staticResources = [
	{
		documentPath: "guide/overview.json",
		staticUrl: "/mcp/guide/overview.json",
		uri: McpSchema.withGuideResourceUri("overview"),
	},
	{
		documentPath: "guide/rules.json",
		staticUrl: "/mcp/guide/rules.json",
		uri: McpSchema.withGuideResourceUri("rules"),
	},
	{
		documentPath: "guide/roles.json",
		staticUrl: "/mcp/guide/roles.json",
		uri: McpSchema.withGuideResourceUri("roles"),
	},
	{
		documentPath: "guide/listing-behavior.json",
		staticUrl: "/mcp/guide/listing-behavior.json",
		uri: McpSchema.withGuideResourceUri("listing-behavior"),
	},
	{
		documentPath: "guide/search-and-ranking.json",
		staticUrl: "/mcp/guide/search-and-ranking.json",
		uri: McpSchema.withGuideResourceUri("search-and-ranking"),
	},
	{
		documentPath: "entity/listing.json",
		staticUrl: "/mcp/entity/listing.json",
		uri: McpSchema.withEntityResourceUri("listing"),
	},
	{
		documentPath: "entity/draft.json",
		staticUrl: "/mcp/entity/draft.json",
		uri: McpSchema.withEntityResourceUri("draft"),
	},
	{
		documentPath: "entity/gallery.json",
		staticUrl: "/mcp/entity/gallery.json",
		uri: McpSchema.withEntityResourceUri("gallery"),
	},
	{
		documentPath: "entity/location.json",
		staticUrl: "/mcp/entity/location.json",
		uri: McpSchema.withEntityResourceUri("location"),
	},
	{
		documentPath: "entity/category.json",
		staticUrl: "/mcp/entity/category.json",
		uri: McpSchema.withEntityResourceUri("category"),
	},
	{
		documentPath: "schema/enum/listing-restriction.json",
		staticUrl: "/mcp/schema/enum/listing-restriction.json",
		uri: McpSchema.withEnumResourceUri("listing-restriction"),
	},
	{
		documentPath: "schema/enum/currency.json",
		staticUrl: "/mcp/schema/enum/currency.json",
		uri: McpSchema.withEnumResourceUri("currency"),
	},
	{
		documentPath: "schema/enum/listing-price.json",
		staticUrl: "/mcp/schema/enum/listing-price.json",
		uri: McpSchema.withEnumResourceUri("listing-price"),
	},
	{
		documentPath: "schema/enum/listing-warranty.json",
		staticUrl: "/mcp/schema/enum/listing-warranty.json",
		uri: McpSchema.withEnumResourceUri("listing-warranty"),
	},
	{
		documentPath: "schema/enum/listing-delivery.json",
		staticUrl: "/mcp/schema/enum/listing-delivery.json",
		uri: McpSchema.withEnumResourceUri("listing-delivery"),
	},
	{
		documentPath: "schema/enum/thumb.json",
		staticUrl: "/mcp/schema/enum/thumb.json",
		uri: McpSchema.withEnumResourceUri("thumb"),
	},
	{
		documentPath: "schema/enum/listing-sort.json",
		staticUrl: "/mcp/schema/enum/listing-sort.json",
		uri: McpSchema.withEnumResourceUri("listing-sort"),
	},
	{
		documentPath: "field/listing-my.json",
		staticUrl: "/mcp/field/listing-my.json",
		uri: McpSchema.withFieldResourceUri("listing.my"),
	},
	{
		documentPath: "field/listing-age.json",
		staticUrl: "/mcp/field/listing-age.json",
		uri: McpSchema.withFieldResourceUri("listing.age"),
	},
	{
		documentPath: "field/listing-condition.json",
		staticUrl: "/mcp/field/listing-condition.json",
		uri: McpSchema.withFieldResourceUri("listing.condition"),
	},
	{
		documentPath: "field/listing-price-type.json",
		staticUrl: "/mcp/field/listing-price-type.json",
		uri: McpSchema.withFieldResourceUri("listing.priceType"),
	},
	{
		documentPath: "field/listing-restriction.json",
		staticUrl: "/mcp/field/listing-restriction.json",
		uri: McpSchema.withFieldResourceUri("listing.restriction"),
	},
	{
		documentPath: "field/listing-warranty.json",
		staticUrl: "/mcp/field/listing-warranty.json",
		uri: McpSchema.withFieldResourceUri("listing.warranty"),
	},
	{
		documentPath: "field/listing-transaction-id.json",
		staticUrl: "/mcp/field/listing-transaction-id.json",
		uri: McpSchema.withFieldResourceUri("listing.transactionId"),
	},
	{
		documentPath: "field/listing-thumb.json",
		staticUrl: "/mcp/field/listing-thumb.json",
		uri: McpSchema.withFieldResourceUri("listing.thumb"),
	},
	{
		documentPath: "field/listing-draft-id.json",
		staticUrl: "/mcp/field/listing-draft-id.json",
		uri: McpSchema.withFieldResourceUri("listing.draftId"),
	},
	{
		documentPath: "field/filter-range.json",
		staticUrl: "/mcp/field/filter-range.json",
		uri: McpSchema.withFieldResourceUri("filter.range"),
	},
	{
		documentPath: "field/filter-with-own.json",
		staticUrl: "/mcp/field/filter-with-own.json",
		uri: McpSchema.withFieldResourceUri("filter.withOwn"),
	},
	{
		documentPath: "field/filter-with-ignored.json",
		staticUrl: "/mcp/field/filter-with-ignored.json",
		uri: McpSchema.withFieldResourceUri("filter.withIgnored"),
	},
	{
		documentPath: "field/filter-feed-id.json",
		staticUrl: "/mcp/field/filter-feed-id.json",
		uri: McpSchema.withFieldResourceUri("filter.feedId"),
	},
] as const satisfies readonly StaticResourceEntry[];

const withPublicPath = (): string => {
	const candidates = [
		join(process.cwd(), "public/mcp"),
		join(process.cwd(), "apps/server/public/mcp"),
		join(process.cwd(), ".vercel/output/static/mcp"),
		join(process.cwd(), "apps/server/.vercel/output/static/mcp"),
		join(process.cwd(), "../static/mcp"),
	];

	for (const candidate of candidates) {
		if (existsSync(candidate)) {
			return candidate;
		}
	}

	throw new Error(`Unable to resolve MCP static resource directory from cwd: ${process.cwd()}`);
};

const publicPath = withPublicPath();

const withDocument = (documentPath: string): StaticResourceDocument.Any => {
	return JSON.parse(
		readFileSync(join(publicPath, documentPath), "utf8"),
	) as StaticResourceDocument.Any;
};

export const withStaticResources = (): McpResourceDefinition.Definition[] => {
	return staticResources.map(({ documentPath, staticUrl, uri }) => {
		const document = withDocument(documentPath);

		return withStaticResourceDefinition({
			document,
			kind: document.kind,
			staticUrl,
			uri,
		});
	});
};
