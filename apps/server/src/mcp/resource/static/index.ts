import overview from "../../../../public/mcp/guide/overview.json";
import searchAndRanking from "../../../../public/mcp/guide/search-and-ranking.json";
import listingBehavior from "../../../../public/mcp/guide/listing-behavior.json";
import roles from "../../../../public/mcp/guide/roles.json";
import rules from "../../../../public/mcp/guide/rules.json";
import category from "../../../../public/mcp/entity/category.json";
import draft from "../../../../public/mcp/entity/draft.json";
import gallery from "../../../../public/mcp/entity/gallery.json";
import listing from "../../../../public/mcp/entity/listing.json";
import location from "../../../../public/mcp/entity/location.json";
import currency from "../../../../public/mcp/schema/enum/currency.json";
import listingDelivery from "../../../../public/mcp/schema/enum/listing-delivery.json";
import listingPrice from "../../../../public/mcp/schema/enum/listing-price.json";
import listingRestriction from "../../../../public/mcp/schema/enum/listing-restriction.json";
import listingSort from "../../../../public/mcp/schema/enum/listing-sort.json";
import listingWarranty from "../../../../public/mcp/schema/enum/listing-warranty.json";
import thumb from "../../../../public/mcp/schema/enum/thumb.json";
import filterFeedId from "../../../../public/mcp/field/filter-feed-id.json";
import filterRange from "../../../../public/mcp/field/filter-range.json";
import filterWithIgnored from "../../../../public/mcp/field/filter-with-ignored.json";
import filterWithOwn from "../../../../public/mcp/field/filter-with-own.json";
import listingAge from "../../../../public/mcp/field/listing-age.json";
import listingCondition from "../../../../public/mcp/field/listing-condition.json";
import listingDraftId from "../../../../public/mcp/field/listing-draft-id.json";
import listingMy from "../../../../public/mcp/field/listing-my.json";
import listingPriceType from "../../../../public/mcp/field/listing-price-type.json";
import listingRestrictionField from "../../../../public/mcp/field/listing-restriction.json";
import listingThumbField from "../../../../public/mcp/field/listing-thumb.json";
import listingTransactionId from "../../../../public/mcp/field/listing-transaction-id.json";
import listingWarrantyField from "../../../../public/mcp/field/listing-warranty.json";
import { McpSchema } from "~/mcp/McpSchema";
import type { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import type { StaticResourceDocument } from "~/mcp/resource/static/StaticResourceDocument";
import { withStaticResourceDefinition } from "~/mcp/resource/static/withStaticResourceDefinition";

interface StaticResourceEntry {
	document: StaticResourceDocument.Any;
	staticUrl: string;
	uri: string;
}

const staticResources = [
	{
		document: overview as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/overview.json",
		uri: McpSchema.withGuideResourceUri("overview"),
	},
	{
		document: rules as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/rules.json",
		uri: McpSchema.withGuideResourceUri("rules"),
	},
	{
		document: roles as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/roles.json",
		uri: McpSchema.withGuideResourceUri("roles"),
	},
	{
		document: listingBehavior as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/listing-behavior.json",
		uri: McpSchema.withGuideResourceUri("listing-behavior"),
	},
	{
		document: searchAndRanking as StaticResourceDocument.Guide,
		staticUrl: "/mcp/guide/search-and-ranking.json",
		uri: McpSchema.withGuideResourceUri("search-and-ranking"),
	},
	{
		document: listing as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/listing.json",
		uri: McpSchema.withEntityResourceUri("listing"),
	},
	{
		document: draft as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/draft.json",
		uri: McpSchema.withEntityResourceUri("draft"),
	},
	{
		document: gallery as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/gallery.json",
		uri: McpSchema.withEntityResourceUri("gallery"),
	},
	{
		document: location as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/location.json",
		uri: McpSchema.withEntityResourceUri("location"),
	},
	{
		document: category as StaticResourceDocument.Entity,
		staticUrl: "/mcp/entity/category.json",
		uri: McpSchema.withEntityResourceUri("category"),
	},
	{
		document: listingRestriction as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-restriction.json",
		uri: McpSchema.withEnumResourceUri("listing-restriction"),
	},
	{
		document: currency as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/currency.json",
		uri: McpSchema.withEnumResourceUri("currency"),
	},
	{
		document: listingPrice as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-price.json",
		uri: McpSchema.withEnumResourceUri("listing-price"),
	},
	{
		document: listingWarranty as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-warranty.json",
		uri: McpSchema.withEnumResourceUri("listing-warranty"),
	},
	{
		document: listingDelivery as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-delivery.json",
		uri: McpSchema.withEnumResourceUri("listing-delivery"),
	},
	{
		document: thumb as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/thumb.json",
		uri: McpSchema.withEnumResourceUri("thumb"),
	},
	{
		document: listingSort as StaticResourceDocument.Enum,
		staticUrl: "/mcp/schema/enum/listing-sort.json",
		uri: McpSchema.withEnumResourceUri("listing-sort"),
	},
	{
		document: listingMy as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-my.json",
		uri: McpSchema.withFieldResourceUri("listing.my"),
	},
	{
		document: listingAge as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-age.json",
		uri: McpSchema.withFieldResourceUri("listing.age"),
	},
	{
		document: listingCondition as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-condition.json",
		uri: McpSchema.withFieldResourceUri("listing.condition"),
	},
	{
		document: listingPriceType as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-price-type.json",
		uri: McpSchema.withFieldResourceUri("listing.priceType"),
	},
	{
		document: listingRestrictionField as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-restriction.json",
		uri: McpSchema.withFieldResourceUri("listing.restriction"),
	},
	{
		document: listingWarrantyField as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-warranty.json",
		uri: McpSchema.withFieldResourceUri("listing.warranty"),
	},
	{
		document: listingTransactionId as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-transaction-id.json",
		uri: McpSchema.withFieldResourceUri("listing.transactionId"),
	},
	{
		document: listingThumbField as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-thumb.json",
		uri: McpSchema.withFieldResourceUri("listing.thumb"),
	},
	{
		document: listingDraftId as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/listing-draft-id.json",
		uri: McpSchema.withFieldResourceUri("listing.draftId"),
	},
	{
		document: filterRange as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/filter-range.json",
		uri: McpSchema.withFieldResourceUri("filter.range"),
	},
	{
		document: filterWithOwn as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/filter-with-own.json",
		uri: McpSchema.withFieldResourceUri("filter.withOwn"),
	},
	{
		document: filterWithIgnored as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/filter-with-ignored.json",
		uri: McpSchema.withFieldResourceUri("filter.withIgnored"),
	},
	{
		document: filterFeedId as StaticResourceDocument.Field,
		staticUrl: "/mcp/field/filter-feed-id.json",
		uri: McpSchema.withFieldResourceUri("filter.feedId"),
	},
] as const satisfies readonly StaticResourceEntry[];

export const withStaticResources = (): McpResourceDefinition.Definition[] => {
	return staticResources.map(({ document, staticUrl, uri }) =>
		withStaticResourceDefinition({
			document,
			kind: document.kind,
			staticUrl,
			uri,
		}),
	);
};
