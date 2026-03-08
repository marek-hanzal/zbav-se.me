import { McpResourceDefinition } from "~/mcp/McpResourceDefinition";
import { McpSchema } from "~/mcp/McpSchema";
import type { StaticResourceDocument } from "~/mcp/resource/static/StaticResourceDocument";
import { withStaticResourceDefinition } from "~/mcp/resource/static/withStaticResourceDefinition";
import EntityCategoryJson from "../../../../public/mcp/entity/category.json";
import EntityDraftJson from "../../../../public/mcp/entity/draft.json";
import EntityGalleryJson from "../../../../public/mcp/entity/gallery.json";
import EntityListingJson from "../../../../public/mcp/entity/listing.json";
import EntityLocationJson from "../../../../public/mcp/entity/location.json";
import EntityUploadJson from "../../../../public/mcp/entity/upload.json";
import FieldCategoryCategoryJson from "../../../../public/mcp/field/category-category.json";
import FieldCategoryFilterFulltextJson from "../../../../public/mcp/field/category-filter-fulltext.json";
import FieldCategoryGroupJson from "../../../../public/mcp/field/category-group.json";
import FieldCategoryIdJson from "../../../../public/mcp/field/category-id.json";
import FieldCategoryIdInJson from "../../../../public/mcp/field/category-id-in.json";
import FieldCategoryLocaleJson from "../../../../public/mcp/field/category-locale.json";
import FieldCategoryLocaleInJson from "../../../../public/mcp/field/category-locale-in.json";
import FieldCategorySlugJson from "../../../../public/mcp/field/category-slug.json";
import FieldCategorySortJson from "../../../../public/mcp/field/category-sort.json";
import FieldCountFilterJson from "../../../../public/mcp/field/count-filter.json";
import FieldCountIsEmptyJson from "../../../../public/mcp/field/count-is-empty.json";
import FieldCountIsFilterEmptyJson from "../../../../public/mcp/field/count-is-filter-empty.json";
import FieldCountTotalJson from "../../../../public/mcp/field/count-total.json";
import FieldCursorPageJson from "../../../../public/mcp/field/cursor-page.json";
import FieldCursorSizeJson from "../../../../public/mcp/field/cursor-size.json";
import FieldDraftAgeJson from "../../../../public/mcp/field/draft-age.json";
import FieldDraftCategoryIdJson from "../../../../public/mcp/field/draft-category-id.json";
import FieldDraftConditionJson from "../../../../public/mcp/field/draft-condition.json";
import FieldDraftConsJson from "../../../../public/mcp/field/draft-cons.json";
import FieldDraftDeliveryJson from "../../../../public/mcp/field/draft-delivery.json";
import FieldDraftDescriptionJson from "../../../../public/mcp/field/draft-description.json";
import FieldDraftExpiresAtJson from "../../../../public/mcp/field/draft-expires-at.json";
import FieldDraftFilterUpdatedAtGteJson from "../../../../public/mcp/field/draft-filter-updated-at-gte.json";
import FieldDraftFilterUpdatedAtLteJson from "../../../../public/mcp/field/draft-filter-updated-at-lte.json";
import FieldDraftFilterUsedAtIsNullJson from "../../../../public/mcp/field/draft-filter-used-at-is-null.json";
import FieldDraftGalleryJson from "../../../../public/mcp/field/draft-gallery.json";
import FieldDraftIdJson from "../../../../public/mcp/field/draft-id.json";
import FieldDraftLocationIdJson from "../../../../public/mcp/field/draft-location-id.json";
import FieldDraftPriceJson from "../../../../public/mcp/field/draft-price.json";
import FieldDraftPriceTypeJson from "../../../../public/mcp/field/draft-price-type.json";
import FieldDraftProsJson from "../../../../public/mcp/field/draft-pros.json";
import FieldDraftRestrictionJson from "../../../../public/mcp/field/draft-restriction.json";
import FieldDraftSortFieldJson from "../../../../public/mcp/field/draft-sort-field.json";
import FieldDraftTitleJson from "../../../../public/mcp/field/draft-title.json";
import FieldDraftUploadIdsJson from "../../../../public/mcp/field/draft-upload-ids.json";
import FieldDraftUsedAtJson from "../../../../public/mcp/field/draft-used-at.json";
import FieldDraftWarrantyJson from "../../../../public/mcp/field/draft-warranty.json";
import FieldFilterAgeInJson from "../../../../public/mcp/field/filter-age-in.json";
import FieldFilterAgeMaxJson from "../../../../public/mcp/field/filter-age-max.json";
import FieldFilterAgeMinJson from "../../../../public/mcp/field/filter-age-min.json";
import FieldFilterCategoryIdJson from "../../../../public/mcp/field/filter-category-id.json";
import FieldFilterCategoryIdInJson from "../../../../public/mcp/field/filter-category-id-in.json";
import FieldFilterConditionInJson from "../../../../public/mcp/field/filter-condition-in.json";
import FieldFilterConditionMaxJson from "../../../../public/mcp/field/filter-condition-max.json";
import FieldFilterConditionMinJson from "../../../../public/mcp/field/filter-condition-min.json";
import FieldFilterCurrencyJson from "../../../../public/mcp/field/filter-currency.json";
import FieldFilterCurrencyInJson from "../../../../public/mcp/field/filter-currency-in.json";
import FieldFilterDeliveryInJson from "../../../../public/mcp/field/filter-delivery-in.json";
import FieldFilterExpiresAtAfterJson from "../../../../public/mcp/field/filter-expires-at-after.json";
import FieldFilterExpiresAtBeforeJson from "../../../../public/mcp/field/filter-expires-at-before.json";
import FieldFilterFeedIdJson from "../../../../public/mcp/field/filter-feed-id.json";
import FieldFilterFeedIdInJson from "../../../../public/mcp/field/filter-feed-id-in.json";
import FieldFilterFulltextJson from "../../../../public/mcp/field/filter-fulltext.json";
import FieldFilterIdJson from "../../../../public/mcp/field/filter-id.json";
import FieldFilterIdInJson from "../../../../public/mcp/field/filter-id-in.json";
import FieldFilterIsFavouriteJson from "../../../../public/mcp/field/filter-is-favourite.json";
import FieldFilterMyJson from "../../../../public/mcp/field/filter-my.json";
import FieldFilterPriceMaxJson from "../../../../public/mcp/field/filter-price-max.json";
import FieldFilterPriceMinJson from "../../../../public/mcp/field/filter-price-min.json";
import FieldFilterRangeJson from "../../../../public/mcp/field/filter-range.json";
import FieldFilterTitleJson from "../../../../public/mcp/field/filter-title.json";
import FieldFilterTransactionJson from "../../../../public/mcp/field/filter-transaction.json";
import FieldFilterUserIdJson from "../../../../public/mcp/field/filter-user-id.json";
import FieldFilterWarrantyInJson from "../../../../public/mcp/field/filter-warranty-in.json";
import FieldFilterWithIgnoredJson from "../../../../public/mcp/field/filter-with-ignored.json";
import FieldFilterWithOwnJson from "../../../../public/mcp/field/filter-with-own.json";
import FieldListingAgeJson from "../../../../public/mcp/field/listing-age.json";
import FieldListingCategoryJson from "../../../../public/mcp/field/listing-category.json";
import FieldListingConditionJson from "../../../../public/mcp/field/listing-condition.json";
import FieldListingDeliveryJson from "../../../../public/mcp/field/listing-delivery.json";
import FieldListingDistanceJson from "../../../../public/mcp/field/listing-distance.json";
import FieldListingDraftIdJson from "../../../../public/mcp/field/listing-draft-id.json";
import FieldListingGalleryJson from "../../../../public/mcp/field/listing-gallery.json";
import FieldListingHasFlagJson from "../../../../public/mcp/field/listing-has-flag.json";
import FieldListingIsFavouriteJson from "../../../../public/mcp/field/listing-is-favourite.json";
import FieldListingIsIgnoredJson from "../../../../public/mcp/field/listing-is-ignored.json";
import FieldListingLocationJson from "../../../../public/mcp/field/listing-location.json";
import FieldListingMyJson from "../../../../public/mcp/field/listing-my.json";
import FieldListingPriceTypeJson from "../../../../public/mcp/field/listing-price-type.json";
import FieldListingRestrictionJson from "../../../../public/mcp/field/listing-restriction.json";
import FieldListingThumbJson from "../../../../public/mcp/field/listing-thumb.json";
import FieldListingTransactionIdJson from "../../../../public/mcp/field/listing-transaction-id.json";
import FieldListingUploadIdsJson from "../../../../public/mcp/field/listing-upload-ids.json";
import FieldListingWarrantyJson from "../../../../public/mcp/field/listing-warranty.json";
import FieldLocationAddressJson from "../../../../public/mcp/field/location-address.json";
import FieldLocationAutocompleteLangJson from "../../../../public/mcp/field/location-autocomplete-lang.json";
import FieldLocationAutocompleteTextJson from "../../../../public/mcp/field/location-autocomplete-text.json";
import FieldLocationCityJson from "../../../../public/mcp/field/location-city.json";
import FieldLocationCodeJson from "../../../../public/mcp/field/location-code.json";
import FieldLocationConfidenceJson from "../../../../public/mcp/field/location-confidence.json";
import FieldLocationCountryJson from "../../../../public/mcp/field/location-country.json";
import FieldLocationLangJson from "../../../../public/mcp/field/location-lang.json";
import FieldLocationLatJson from "../../../../public/mcp/field/location-lat.json";
import FieldLocationLonJson from "../../../../public/mcp/field/location-lon.json";
import FieldLocationQueryJson from "../../../../public/mcp/field/location-query.json";
import FieldLocationStreetJson from "../../../../public/mcp/field/location-street.json";
import FieldLocationZipJson from "../../../../public/mcp/field/location-zip.json";
import FieldMetaFeedIdJson from "../../../../public/mcp/field/meta-feed-id.json";
import FieldMetaLatLonJson from "../../../../public/mcp/field/meta-lat-lon.json";
import FieldS3CdnJson from "../../../../public/mcp/field/s3-cdn.json";
import FieldS3ContentTypeJson from "../../../../public/mcp/field/s3-content-type.json";
import FieldS3ExtensionJson from "../../../../public/mcp/field/s3-extension.json";
import FieldS3PathJson from "../../../../public/mcp/field/s3-path.json";
import FieldS3UrlJson from "../../../../public/mcp/field/s3-url.json";
import FieldSortFieldJson from "../../../../public/mcp/field/sort-field.json";
import FieldSortOrderJson from "../../../../public/mcp/field/sort-order.json";
import FieldUploadIdJson from "../../../../public/mcp/field/upload-id.json";
import FieldUploadUrlJson from "../../../../public/mcp/field/upload-url.json";
import GuideDraftWriteFlowJson from "../../../../public/mcp/guide/draft-write-flow.json";
import GuideFailuresJson from "../../../../public/mcp/guide/failures.json";
import GuideListingBehaviorJson from "../../../../public/mcp/guide/listing-behavior.json";
import GuideNamespacesJson from "../../../../public/mcp/guide/namespaces.json";
import GuideOverviewJson from "../../../../public/mcp/guide/overview.json";
import GuideQueryProfilesJson from "../../../../public/mcp/guide/query-profiles.json";
import GuideRolesJson from "../../../../public/mcp/guide/roles.json";
import GuideRulesJson from "../../../../public/mcp/guide/rules.json";
import GuideSearchAndRankingJson from "../../../../public/mcp/guide/search-and-ranking.json";
import ProfileBuyerSearchByCategoryJson from "../../../../public/mcp/profile/buyer-search-by-category.json";
import ProfileBuyerSearchByDeliveryJson from "../../../../public/mcp/profile/buyer-search-by-delivery.json";
import ProfileBuyerSearchFavouritesJson from "../../../../public/mcp/profile/buyer-search-favourites.json";
import ProfileBuyerSearchMineJson from "../../../../public/mcp/profile/buyer-search-mine.json";
import ProfileBuyerSearchNearbyJson from "../../../../public/mcp/profile/buyer-search-nearby.json";
import ProfileSellerDraftCreateCompleteJson from "../../../../public/mcp/profile/seller-draft-create-complete.json";
import ProfileSellerDraftFetchExactJson from "../../../../public/mcp/profile/seller-draft-fetch-exact.json";
import ProfileSellerDraftGalleryReplaceJson from "../../../../public/mcp/profile/seller-draft-gallery-replace.json";
import ProfileSellerDraftPatchProgressiveJson from "../../../../public/mcp/profile/seller-draft-patch-progressive.json";
import ProfileSellerDraftReviewRecentJson from "../../../../public/mcp/profile/seller-draft-review-recent.json";
import ProfileSellerDraftUnusedJson from "../../../../public/mcp/profile/seller-draft-unused.json";
import ProfileSellerImagePrepareUploadJson from "../../../../public/mcp/profile/seller-image-upload-prepare.json";
import ProfileSellerListingCountPublishedJson from "../../../../public/mcp/profile/seller-listing-count-published.json";
import ProfileSellerListingPublishFromDraftJson from "../../../../public/mcp/profile/seller-listing-publish-from-draft.json";
import ProfileSessionCategorySelectJson from "../../../../public/mcp/profile/session-category-select.json";
import ProfileSessionLocationAutocompleteJson from "../../../../public/mcp/profile/session-location-autocomplete.json";
import ProfileSessionLocationTranslateAddressJson from "../../../../public/mcp/profile/session-location-translate-address.json";
import SchemaEnumAllowedContentTypeJson from "../../../../public/mcp/schema/enum/allowed-content-type.json";
import SchemaEnumAllowedExtensionJson from "../../../../public/mcp/schema/enum/allowed-extension.json";
import SchemaEnumCurrencyJson from "../../../../public/mcp/schema/enum/currency.json";
import SchemaEnumListingDeliveryJson from "../../../../public/mcp/schema/enum/listing-delivery.json";
import SchemaEnumListingExpireJson from "../../../../public/mcp/schema/enum/listing-expire.json";
import SchemaEnumListingPriceJson from "../../../../public/mcp/schema/enum/listing-price.json";
import SchemaEnumListingRestrictionJson from "../../../../public/mcp/schema/enum/listing-restriction.json";
import SchemaEnumListingSortJson from "../../../../public/mcp/schema/enum/listing-sort.json";
import SchemaEnumListingWarrantyJson from "../../../../public/mcp/schema/enum/listing-warranty.json";
import SchemaEnumThumbJson from "../../../../public/mcp/schema/enum/thumb.json";

interface StaticResourceEntry {
	documentPath: string;
	staticUrl: string;
	uri: string;
}

interface StaticFieldResourceEntry extends StaticResourceEntry {
	fieldName: string;
}

interface StaticProfileResourceEntry extends StaticResourceEntry {
	profileName: string;
}

interface StaticEntityResourceEntry extends StaticResourceEntry {
	entityName: string;
}

interface StaticEnumResourceEntry extends StaticResourceEntry {
	enumName: string;
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
		documentPath: "guide/namespaces.json",
		staticUrl: "/mcp/guide/namespaces.json",
		uri: McpSchema.withGuideResourceUri("namespaces"),
	},
	{
		documentPath: "guide/search-and-ranking.json",
		staticUrl: "/mcp/guide/search-and-ranking.json",
		uri: McpSchema.withGuideResourceUri("search-and-ranking"),
	},
	{
		documentPath: "guide/query-profiles.json",
		staticUrl: "/mcp/guide/query-profiles.json",
		uri: McpSchema.withGuideResourceUri("query-profiles"),
	},
	{
		documentPath: "guide/draft-write-flow.json",
		staticUrl: "/mcp/guide/draft-write-flow.json",
		uri: McpSchema.withGuideResourceUri("draft-write-flow"),
	},
	{
		documentPath: "guide/failures.json",
		staticUrl: "/mcp/guide/failures.json",
		uri: McpSchema.withGuideResourceUri("failures"),
	},
] as const satisfies readonly StaticResourceEntry[];

const staticProfileResources = [
	{
		profileName: "buyer.search.byDelivery",
		documentPath: "profile/buyer-search-by-delivery.json",
		staticUrl: "/mcp/profile/buyer-search-by-delivery.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.byDelivery"),
	},
	{
		profileName: "buyer.search.nearby",
		documentPath: "profile/buyer-search-nearby.json",
		staticUrl: "/mcp/profile/buyer-search-nearby.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.nearby"),
	},
	{
		profileName: "buyer.search.mine",
		documentPath: "profile/buyer-search-mine.json",
		staticUrl: "/mcp/profile/buyer-search-mine.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.mine"),
	},
	{
		profileName: "buyer.search.byCategory",
		documentPath: "profile/buyer-search-by-category.json",
		staticUrl: "/mcp/profile/buyer-search-by-category.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.byCategory"),
	},
	{
		profileName: "buyer.search.favourites",
		documentPath: "profile/buyer-search-favourites.json",
		staticUrl: "/mcp/profile/buyer-search-favourites.json",
		uri: McpSchema.withProfileResourceUri("buyer.search.favourites"),
	},
	{
		profileName: "session.category.select",
		documentPath: "profile/session-category-select.json",
		staticUrl: "/mcp/profile/session-category-select.json",
		uri: McpSchema.withProfileResourceUri("session.category.select"),
	},
	{
		profileName: "session.location.autocomplete",
		documentPath: "profile/session-location-autocomplete.json",
		staticUrl: "/mcp/profile/session-location-autocomplete.json",
		uri: McpSchema.withProfileResourceUri("session.location.autocomplete"),
	},
	{
		profileName: "session.location.translateAddress",
		documentPath: "profile/session-location-translate-address.json",
		staticUrl: "/mcp/profile/session-location-translate-address.json",
		uri: McpSchema.withProfileResourceUri("session.location.translateAddress"),
	},
	{
		profileName: "seller.draft.createComplete",
		documentPath: "profile/seller-draft-create-complete.json",
		staticUrl: "/mcp/profile/seller-draft-create-complete.json",
		uri: McpSchema.withProfileResourceUri("seller.draft.createComplete"),
	},
	{
		profileName: "seller.draft.patchProgressive",
		documentPath: "profile/seller-draft-patch-progressive.json",
		staticUrl: "/mcp/profile/seller-draft-patch-progressive.json",
		uri: McpSchema.withProfileResourceUri("seller.draft.patchProgressive"),
	},
	{
		profileName: "seller.draft.reviewRecent",
		documentPath: "profile/seller-draft-review-recent.json",
		staticUrl: "/mcp/profile/seller-draft-review-recent.json",
		uri: McpSchema.withProfileResourceUri("seller.draft.reviewRecent"),
	},
	{
		profileName: "seller.draft.fetchExact",
		documentPath: "profile/seller-draft-fetch-exact.json",
		staticUrl: "/mcp/profile/seller-draft-fetch-exact.json",
		uri: McpSchema.withProfileResourceUri("seller.draft.fetchExact"),
	},
	{
		profileName: "seller.draft.unused",
		documentPath: "profile/seller-draft-unused.json",
		staticUrl: "/mcp/profile/seller-draft-unused.json",
		uri: McpSchema.withProfileResourceUri("seller.draft.unused"),
	},
	{
		profileName: "seller.image.prepareUpload",
		documentPath: "profile/seller-image-upload-prepare.json",
		staticUrl: "/mcp/profile/seller-image-upload-prepare.json",
		uri: McpSchema.withProfileResourceUri("seller.image.prepareUpload"),
	},
	{
		profileName: "seller.draft.galleryReplace",
		documentPath: "profile/seller-draft-gallery-replace.json",
		staticUrl: "/mcp/profile/seller-draft-gallery-replace.json",
		uri: McpSchema.withProfileResourceUri("seller.draft.galleryReplace"),
	},
	{
		profileName: "seller.listing.publishFromDraft",
		documentPath: "profile/seller-listing-publish-from-draft.json",
		staticUrl: "/mcp/profile/seller-listing-publish-from-draft.json",
		uri: McpSchema.withProfileResourceUri("seller.listing.publishFromDraft"),
	},
	{
		profileName: "seller.listing.countPublished",
		documentPath: "profile/seller-listing-count-published.json",
		staticUrl: "/mcp/profile/seller-listing-count-published.json",
		uri: McpSchema.withProfileResourceUri("seller.listing.countPublished"),
	},
] as const satisfies readonly StaticProfileResourceEntry[];

const staticEntityResources = [
	{
		entityName: "listing",
		documentPath: "entity/listing.json",
		staticUrl: "/mcp/entity/listing.json",
		uri: McpSchema.withEntityResourceUri("listing"),
	},
	{
		entityName: "draft",
		documentPath: "entity/draft.json",
		staticUrl: "/mcp/entity/draft.json",
		uri: McpSchema.withEntityResourceUri("draft"),
	},
	{
		entityName: "gallery",
		documentPath: "entity/gallery.json",
		staticUrl: "/mcp/entity/gallery.json",
		uri: McpSchema.withEntityResourceUri("gallery"),
	},
	{
		entityName: "location",
		documentPath: "entity/location.json",
		staticUrl: "/mcp/entity/location.json",
		uri: McpSchema.withEntityResourceUri("location"),
	},
	{
		entityName: "category",
		documentPath: "entity/category.json",
		staticUrl: "/mcp/entity/category.json",
		uri: McpSchema.withEntityResourceUri("category"),
	},
	{
		entityName: "upload",
		documentPath: "entity/upload.json",
		staticUrl: "/mcp/entity/upload.json",
		uri: McpSchema.withEntityResourceUri("upload"),
	},
] as const satisfies readonly StaticEntityResourceEntry[];

const staticEnumResources = [
	{
		enumName: "listing-restriction",
		documentPath: "schema/enum/listing-restriction.json",
		staticUrl: "/mcp/schema/enum/listing-restriction.json",
		uri: McpSchema.withEnumResourceUri("listing-restriction"),
	},
	{
		enumName: "allowed-extension",
		documentPath: "schema/enum/allowed-extension.json",
		staticUrl: "/mcp/schema/enum/allowed-extension.json",
		uri: McpSchema.withEnumResourceUri("allowed-extension"),
	},
	{
		enumName: "allowed-content-type",
		documentPath: "schema/enum/allowed-content-type.json",
		staticUrl: "/mcp/schema/enum/allowed-content-type.json",
		uri: McpSchema.withEnumResourceUri("allowed-content-type"),
	},
	{
		enumName: "currency",
		documentPath: "schema/enum/currency.json",
		staticUrl: "/mcp/schema/enum/currency.json",
		uri: McpSchema.withEnumResourceUri("currency"),
	},
	{
		enumName: "listing-expire",
		documentPath: "schema/enum/listing-expire.json",
		staticUrl: "/mcp/schema/enum/listing-expire.json",
		uri: McpSchema.withEnumResourceUri("listing-expire"),
	},
	{
		enumName: "listing-price",
		documentPath: "schema/enum/listing-price.json",
		staticUrl: "/mcp/schema/enum/listing-price.json",
		uri: McpSchema.withEnumResourceUri("listing-price"),
	},
	{
		enumName: "listing-warranty",
		documentPath: "schema/enum/listing-warranty.json",
		staticUrl: "/mcp/schema/enum/listing-warranty.json",
		uri: McpSchema.withEnumResourceUri("listing-warranty"),
	},
	{
		enumName: "listing-delivery",
		documentPath: "schema/enum/listing-delivery.json",
		staticUrl: "/mcp/schema/enum/listing-delivery.json",
		uri: McpSchema.withEnumResourceUri("listing-delivery"),
	},
	{
		enumName: "thumb",
		documentPath: "schema/enum/thumb.json",
		staticUrl: "/mcp/schema/enum/thumb.json",
		uri: McpSchema.withEnumResourceUri("thumb"),
	},
	{
		enumName: "listing-sort",
		documentPath: "schema/enum/listing-sort.json",
		staticUrl: "/mcp/schema/enum/listing-sort.json",
		uri: McpSchema.withEnumResourceUri("listing-sort"),
	},
] as const satisfies readonly StaticEnumResourceEntry[];

const staticFieldResources = [
	{
		fieldName: "cursor.page",
		documentPath: "field/cursor-page.json",
		staticUrl: "/mcp/field/cursor-page.json",
		uri: McpSchema.withFieldResourceUri("cursor.page"),
	},
	{
		fieldName: "cursor.size",
		documentPath: "field/cursor-size.json",
		staticUrl: "/mcp/field/cursor-size.json",
		uri: McpSchema.withFieldResourceUri("cursor.size"),
	},
	{
		fieldName: "category.filter.fulltext",
		documentPath: "field/category-filter-fulltext.json",
		staticUrl: "/mcp/field/category-filter-fulltext.json",
		uri: McpSchema.withFieldResourceUri("category.filter.fulltext"),
	},
	{
		fieldName: "category.id",
		documentPath: "field/category-id.json",
		staticUrl: "/mcp/field/category-id.json",
		uri: McpSchema.withFieldResourceUri("category.id"),
	},
	{
		fieldName: "category.idIn",
		documentPath: "field/category-id-in.json",
		staticUrl: "/mcp/field/category-id-in.json",
		uri: McpSchema.withFieldResourceUri("category.idIn"),
	},
	{
		fieldName: "category.group",
		documentPath: "field/category-group.json",
		staticUrl: "/mcp/field/category-group.json",
		uri: McpSchema.withFieldResourceUri("category.group"),
	},
	{
		fieldName: "category.category",
		documentPath: "field/category-category.json",
		staticUrl: "/mcp/field/category-category.json",
		uri: McpSchema.withFieldResourceUri("category.category"),
	},
	{
		fieldName: "category.slug",
		documentPath: "field/category-slug.json",
		staticUrl: "/mcp/field/category-slug.json",
		uri: McpSchema.withFieldResourceUri("category.slug"),
	},
	{
		fieldName: "category.locale",
		documentPath: "field/category-locale.json",
		staticUrl: "/mcp/field/category-locale.json",
		uri: McpSchema.withFieldResourceUri("category.locale"),
	},
	{
		fieldName: "category.localeIn",
		documentPath: "field/category-locale-in.json",
		staticUrl: "/mcp/field/category-locale-in.json",
		uri: McpSchema.withFieldResourceUri("category.localeIn"),
	},
	{
		fieldName: "category.sort",
		documentPath: "field/category-sort.json",
		staticUrl: "/mcp/field/category-sort.json",
		uri: McpSchema.withFieldResourceUri("category.sort"),
	},
	{
		fieldName: "draft.id",
		documentPath: "field/draft-id.json",
		staticUrl: "/mcp/field/draft-id.json",
		uri: McpSchema.withFieldResourceUri("draft.id"),
	},
	{
		fieldName: "draft.title",
		documentPath: "field/draft-title.json",
		staticUrl: "/mcp/field/draft-title.json",
		uri: McpSchema.withFieldResourceUri("draft.title"),
	},
	{
		fieldName: "draft.description",
		documentPath: "field/draft-description.json",
		staticUrl: "/mcp/field/draft-description.json",
		uri: McpSchema.withFieldResourceUri("draft.description"),
	},
	{
		fieldName: "draft.price",
		documentPath: "field/draft-price.json",
		staticUrl: "/mcp/field/draft-price.json",
		uri: McpSchema.withFieldResourceUri("draft.price"),
	},
	{
		fieldName: "draft.priceType",
		documentPath: "field/draft-price-type.json",
		staticUrl: "/mcp/field/draft-price-type.json",
		uri: McpSchema.withFieldResourceUri("draft.priceType"),
	},
	{
		fieldName: "draft.condition",
		documentPath: "field/draft-condition.json",
		staticUrl: "/mcp/field/draft-condition.json",
		uri: McpSchema.withFieldResourceUri("draft.condition"),
	},
	{
		fieldName: "draft.age",
		documentPath: "field/draft-age.json",
		staticUrl: "/mcp/field/draft-age.json",
		uri: McpSchema.withFieldResourceUri("draft.age"),
	},
	{
		fieldName: "draft.delivery",
		documentPath: "field/draft-delivery.json",
		staticUrl: "/mcp/field/draft-delivery.json",
		uri: McpSchema.withFieldResourceUri("draft.delivery"),
	},
	{
		fieldName: "draft.warranty",
		documentPath: "field/draft-warranty.json",
		staticUrl: "/mcp/field/draft-warranty.json",
		uri: McpSchema.withFieldResourceUri("draft.warranty"),
	},
	{
		fieldName: "draft.restriction",
		documentPath: "field/draft-restriction.json",
		staticUrl: "/mcp/field/draft-restriction.json",
		uri: McpSchema.withFieldResourceUri("draft.restriction"),
	},
	{
		fieldName: "draft.locationId",
		documentPath: "field/draft-location-id.json",
		staticUrl: "/mcp/field/draft-location-id.json",
		uri: McpSchema.withFieldResourceUri("draft.locationId"),
	},
	{
		fieldName: "draft.categoryId",
		documentPath: "field/draft-category-id.json",
		staticUrl: "/mcp/field/draft-category-id.json",
		uri: McpSchema.withFieldResourceUri("draft.categoryId"),
	},
	{
		fieldName: "draft.expiresAt",
		documentPath: "field/draft-expires-at.json",
		staticUrl: "/mcp/field/draft-expires-at.json",
		uri: McpSchema.withFieldResourceUri("draft.expiresAt"),
	},
	{
		fieldName: "draft.pros",
		documentPath: "field/draft-pros.json",
		staticUrl: "/mcp/field/draft-pros.json",
		uri: McpSchema.withFieldResourceUri("draft.pros"),
	},
	{
		fieldName: "draft.cons",
		documentPath: "field/draft-cons.json",
		staticUrl: "/mcp/field/draft-cons.json",
		uri: McpSchema.withFieldResourceUri("draft.cons"),
	},
	{
		fieldName: "draft.uploadIds",
		documentPath: "field/draft-upload-ids.json",
		staticUrl: "/mcp/field/draft-upload-ids.json",
		uri: McpSchema.withFieldResourceUri("draft.uploadIds"),
	},
	{
		fieldName: "draft.gallery",
		documentPath: "field/draft-gallery.json",
		staticUrl: "/mcp/field/draft-gallery.json",
		uri: McpSchema.withFieldResourceUri("draft.gallery"),
	},
	{
		fieldName: "draft.usedAt",
		documentPath: "field/draft-used-at.json",
		staticUrl: "/mcp/field/draft-used-at.json",
		uri: McpSchema.withFieldResourceUri("draft.usedAt"),
	},
	{
		fieldName: "draft.filter.updatedAtGte",
		documentPath: "field/draft-filter-updated-at-gte.json",
		staticUrl: "/mcp/field/draft-filter-updated-at-gte.json",
		uri: McpSchema.withFieldResourceUri("draft.filter.updatedAtGte"),
	},
	{
		fieldName: "draft.filter.updatedAtLte",
		documentPath: "field/draft-filter-updated-at-lte.json",
		staticUrl: "/mcp/field/draft-filter-updated-at-lte.json",
		uri: McpSchema.withFieldResourceUri("draft.filter.updatedAtLte"),
	},
	{
		fieldName: "draft.filter.usedAtIsNull",
		documentPath: "field/draft-filter-used-at-is-null.json",
		staticUrl: "/mcp/field/draft-filter-used-at-is-null.json",
		uri: McpSchema.withFieldResourceUri("draft.filter.usedAtIsNull"),
	},
	{
		fieldName: "draft.sortField",
		documentPath: "field/draft-sort-field.json",
		staticUrl: "/mcp/field/draft-sort-field.json",
		uri: McpSchema.withFieldResourceUri("draft.sortField"),
	},
	{
		fieldName: "count.total",
		documentPath: "field/count-total.json",
		staticUrl: "/mcp/field/count-total.json",
		uri: McpSchema.withFieldResourceUri("count.total"),
	},
	{
		fieldName: "count.filter",
		documentPath: "field/count-filter.json",
		staticUrl: "/mcp/field/count-filter.json",
		uri: McpSchema.withFieldResourceUri("count.filter"),
	},
	{
		fieldName: "count.isEmpty",
		documentPath: "field/count-is-empty.json",
		staticUrl: "/mcp/field/count-is-empty.json",
		uri: McpSchema.withFieldResourceUri("count.isEmpty"),
	},
	{
		fieldName: "count.isFilterEmpty",
		documentPath: "field/count-is-filter-empty.json",
		staticUrl: "/mcp/field/count-is-filter-empty.json",
		uri: McpSchema.withFieldResourceUri("count.isFilterEmpty"),
	},
	{
		fieldName: "filter.id",
		documentPath: "field/filter-id.json",
		staticUrl: "/mcp/field/filter-id.json",
		uri: McpSchema.withFieldResourceUri("filter.id"),
	},
	{
		fieldName: "filter.idIn",
		documentPath: "field/filter-id-in.json",
		staticUrl: "/mcp/field/filter-id-in.json",
		uri: McpSchema.withFieldResourceUri("filter.idIn"),
	},
	{
		fieldName: "filter.fulltext",
		documentPath: "field/filter-fulltext.json",
		staticUrl: "/mcp/field/filter-fulltext.json",
		uri: McpSchema.withFieldResourceUri("filter.fulltext"),
	},
	{
		fieldName: "filter.userId",
		documentPath: "field/filter-user-id.json",
		staticUrl: "/mcp/field/filter-user-id.json",
		uri: McpSchema.withFieldResourceUri("filter.userId"),
	},
	{
		fieldName: "filter.priceMin",
		documentPath: "field/filter-price-min.json",
		staticUrl: "/mcp/field/filter-price-min.json",
		uri: McpSchema.withFieldResourceUri("filter.priceMin"),
	},
	{
		fieldName: "filter.priceMax",
		documentPath: "field/filter-price-max.json",
		staticUrl: "/mcp/field/filter-price-max.json",
		uri: McpSchema.withFieldResourceUri("filter.priceMax"),
	},
	{
		fieldName: "filter.conditionMin",
		documentPath: "field/filter-condition-min.json",
		staticUrl: "/mcp/field/filter-condition-min.json",
		uri: McpSchema.withFieldResourceUri("filter.conditionMin"),
	},
	{
		fieldName: "filter.conditionMax",
		documentPath: "field/filter-condition-max.json",
		staticUrl: "/mcp/field/filter-condition-max.json",
		uri: McpSchema.withFieldResourceUri("filter.conditionMax"),
	},
	{
		fieldName: "filter.conditionIn",
		documentPath: "field/filter-condition-in.json",
		staticUrl: "/mcp/field/filter-condition-in.json",
		uri: McpSchema.withFieldResourceUri("filter.conditionIn"),
	},
	{
		fieldName: "filter.ageMin",
		documentPath: "field/filter-age-min.json",
		staticUrl: "/mcp/field/filter-age-min.json",
		uri: McpSchema.withFieldResourceUri("filter.ageMin"),
	},
	{
		fieldName: "filter.ageMax",
		documentPath: "field/filter-age-max.json",
		staticUrl: "/mcp/field/filter-age-max.json",
		uri: McpSchema.withFieldResourceUri("filter.ageMax"),
	},
	{
		fieldName: "filter.ageIn",
		documentPath: "field/filter-age-in.json",
		staticUrl: "/mcp/field/filter-age-in.json",
		uri: McpSchema.withFieldResourceUri("filter.ageIn"),
	},
	{
		fieldName: "filter.deliveryIn",
		documentPath: "field/filter-delivery-in.json",
		staticUrl: "/mcp/field/filter-delivery-in.json",
		uri: McpSchema.withFieldResourceUri("filter.deliveryIn"),
	},
	{
		fieldName: "filter.warrantyIn",
		documentPath: "field/filter-warranty-in.json",
		staticUrl: "/mcp/field/filter-warranty-in.json",
		uri: McpSchema.withFieldResourceUri("filter.warrantyIn"),
	},
	{
		fieldName: "filter.categoryId",
		documentPath: "field/filter-category-id.json",
		staticUrl: "/mcp/field/filter-category-id.json",
		uri: McpSchema.withFieldResourceUri("filter.categoryId"),
	},
	{
		fieldName: "filter.categoryIdIn",
		documentPath: "field/filter-category-id-in.json",
		staticUrl: "/mcp/field/filter-category-id-in.json",
		uri: McpSchema.withFieldResourceUri("filter.categoryIdIn"),
	},
	{
		fieldName: "filter.currency",
		documentPath: "field/filter-currency.json",
		staticUrl: "/mcp/field/filter-currency.json",
		uri: McpSchema.withFieldResourceUri("filter.currency"),
	},
	{
		fieldName: "filter.currencyIn",
		documentPath: "field/filter-currency-in.json",
		staticUrl: "/mcp/field/filter-currency-in.json",
		uri: McpSchema.withFieldResourceUri("filter.currencyIn"),
	},
	{
		fieldName: "filter.expiresAtBefore",
		documentPath: "field/filter-expires-at-before.json",
		staticUrl: "/mcp/field/filter-expires-at-before.json",
		uri: McpSchema.withFieldResourceUri("filter.expiresAtBefore"),
	},
	{
		fieldName: "filter.expiresAtAfter",
		documentPath: "field/filter-expires-at-after.json",
		staticUrl: "/mcp/field/filter-expires-at-after.json",
		uri: McpSchema.withFieldResourceUri("filter.expiresAtAfter"),
	},
	{
		fieldName: "locationAutocomplete.text",
		documentPath: "field/location-autocomplete-text.json",
		staticUrl: "/mcp/field/location-autocomplete-text.json",
		uri: McpSchema.withFieldResourceUri("locationAutocomplete.text"),
	},
	{
		fieldName: "locationAutocomplete.lang",
		documentPath: "field/location-autocomplete-lang.json",
		staticUrl: "/mcp/field/location-autocomplete-lang.json",
		uri: McpSchema.withFieldResourceUri("locationAutocomplete.lang"),
	},
	{
		fieldName: "location.query",
		documentPath: "field/location-query.json",
		staticUrl: "/mcp/field/location-query.json",
		uri: McpSchema.withFieldResourceUri("location.query"),
	},
	{
		fieldName: "location.lang",
		documentPath: "field/location-lang.json",
		staticUrl: "/mcp/field/location-lang.json",
		uri: McpSchema.withFieldResourceUri("location.lang"),
	},
	{
		fieldName: "location.address",
		documentPath: "field/location-address.json",
		staticUrl: "/mcp/field/location-address.json",
		uri: McpSchema.withFieldResourceUri("location.address"),
	},
	{
		fieldName: "location.city",
		documentPath: "field/location-city.json",
		staticUrl: "/mcp/field/location-city.json",
		uri: McpSchema.withFieldResourceUri("location.city"),
	},
	{
		fieldName: "location.street",
		documentPath: "field/location-street.json",
		staticUrl: "/mcp/field/location-street.json",
		uri: McpSchema.withFieldResourceUri("location.street"),
	},
	{
		fieldName: "location.zip",
		documentPath: "field/location-zip.json",
		staticUrl: "/mcp/field/location-zip.json",
		uri: McpSchema.withFieldResourceUri("location.zip"),
	},
	{
		fieldName: "location.country",
		documentPath: "field/location-country.json",
		staticUrl: "/mcp/field/location-country.json",
		uri: McpSchema.withFieldResourceUri("location.country"),
	},
	{
		fieldName: "location.code",
		documentPath: "field/location-code.json",
		staticUrl: "/mcp/field/location-code.json",
		uri: McpSchema.withFieldResourceUri("location.code"),
	},
	{
		fieldName: "location.confidence",
		documentPath: "field/location-confidence.json",
		staticUrl: "/mcp/field/location-confidence.json",
		uri: McpSchema.withFieldResourceUri("location.confidence"),
	},
	{
		fieldName: "location.lat",
		documentPath: "field/location-lat.json",
		staticUrl: "/mcp/field/location-lat.json",
		uri: McpSchema.withFieldResourceUri("location.lat"),
	},
	{
		fieldName: "location.lon",
		documentPath: "field/location-lon.json",
		staticUrl: "/mcp/field/location-lon.json",
		uri: McpSchema.withFieldResourceUri("location.lon"),
	},
	{
		fieldName: "listing.my",
		documentPath: "field/listing-my.json",
		staticUrl: "/mcp/field/listing-my.json",
		uri: McpSchema.withFieldResourceUri("listing.my"),
	},
	{
		fieldName: "listing.age",
		documentPath: "field/listing-age.json",
		staticUrl: "/mcp/field/listing-age.json",
		uri: McpSchema.withFieldResourceUri("listing.age"),
	},
	{
		fieldName: "listing.condition",
		documentPath: "field/listing-condition.json",
		staticUrl: "/mcp/field/listing-condition.json",
		uri: McpSchema.withFieldResourceUri("listing.condition"),
	},
	{
		fieldName: "listing.priceType",
		documentPath: "field/listing-price-type.json",
		staticUrl: "/mcp/field/listing-price-type.json",
		uri: McpSchema.withFieldResourceUri("listing.priceType"),
	},
	{
		fieldName: "listing.restriction",
		documentPath: "field/listing-restriction.json",
		staticUrl: "/mcp/field/listing-restriction.json",
		uri: McpSchema.withFieldResourceUri("listing.restriction"),
	},
	{
		fieldName: "listing.warranty",
		documentPath: "field/listing-warranty.json",
		staticUrl: "/mcp/field/listing-warranty.json",
		uri: McpSchema.withFieldResourceUri("listing.warranty"),
	},
	{
		fieldName: "listing.transactionId",
		documentPath: "field/listing-transaction-id.json",
		staticUrl: "/mcp/field/listing-transaction-id.json",
		uri: McpSchema.withFieldResourceUri("listing.transactionId"),
	},
	{
		fieldName: "listing.delivery",
		documentPath: "field/listing-delivery.json",
		staticUrl: "/mcp/field/listing-delivery.json",
		uri: McpSchema.withFieldResourceUri("listing.delivery"),
	},
	{
		fieldName: "listing.location",
		documentPath: "field/listing-location.json",
		staticUrl: "/mcp/field/listing-location.json",
		uri: McpSchema.withFieldResourceUri("listing.location"),
	},
	{
		fieldName: "listing.category",
		documentPath: "field/listing-category.json",
		staticUrl: "/mcp/field/listing-category.json",
		uri: McpSchema.withFieldResourceUri("listing.category"),
	},
	{
		fieldName: "listing.gallery",
		documentPath: "field/listing-gallery.json",
		staticUrl: "/mcp/field/listing-gallery.json",
		uri: McpSchema.withFieldResourceUri("listing.gallery"),
	},
	{
		fieldName: "listing.thumb",
		documentPath: "field/listing-thumb.json",
		staticUrl: "/mcp/field/listing-thumb.json",
		uri: McpSchema.withFieldResourceUri("listing.thumb"),
	},
	{
		fieldName: "listing.draftId",
		documentPath: "field/listing-draft-id.json",
		staticUrl: "/mcp/field/listing-draft-id.json",
		uri: McpSchema.withFieldResourceUri("listing.draftId"),
	},
	{
		fieldName: "listing.uploadIds",
		documentPath: "field/listing-upload-ids.json",
		staticUrl: "/mcp/field/listing-upload-ids.json",
		uri: McpSchema.withFieldResourceUri("listing.uploadIds"),
	},
	{
		fieldName: "filter.range",
		documentPath: "field/filter-range.json",
		staticUrl: "/mcp/field/filter-range.json",
		uri: McpSchema.withFieldResourceUri("filter.range"),
	},
	{
		fieldName: "filter.withOwn",
		documentPath: "field/filter-with-own.json",
		staticUrl: "/mcp/field/filter-with-own.json",
		uri: McpSchema.withFieldResourceUri("filter.withOwn"),
	},
	{
		fieldName: "filter.withIgnored",
		documentPath: "field/filter-with-ignored.json",
		staticUrl: "/mcp/field/filter-with-ignored.json",
		uri: McpSchema.withFieldResourceUri("filter.withIgnored"),
	},
	{
		fieldName: "filter.feedId",
		documentPath: "field/filter-feed-id.json",
		staticUrl: "/mcp/field/filter-feed-id.json",
		uri: McpSchema.withFieldResourceUri("filter.feedId"),
	},
	{
		fieldName: "filter.feedIdIn",
		documentPath: "field/filter-feed-id-in.json",
		staticUrl: "/mcp/field/filter-feed-id-in.json",
		uri: McpSchema.withFieldResourceUri("filter.feedIdIn"),
	},
	{
		fieldName: "listing.distance",
		documentPath: "field/listing-distance.json",
		staticUrl: "/mcp/field/listing-distance.json",
		uri: McpSchema.withFieldResourceUri("listing.distance"),
	},
	{
		fieldName: "listing.isFavourite",
		documentPath: "field/listing-is-favourite.json",
		staticUrl: "/mcp/field/listing-is-favourite.json",
		uri: McpSchema.withFieldResourceUri("listing.isFavourite"),
	},
	{
		fieldName: "listing.isIgnored",
		documentPath: "field/listing-is-ignored.json",
		staticUrl: "/mcp/field/listing-is-ignored.json",
		uri: McpSchema.withFieldResourceUri("listing.isIgnored"),
	},
	{
		fieldName: "listing.hasFlag",
		documentPath: "field/listing-has-flag.json",
		staticUrl: "/mcp/field/listing-has-flag.json",
		uri: McpSchema.withFieldResourceUri("listing.hasFlag"),
	},
	{
		fieldName: "filter.my",
		documentPath: "field/filter-my.json",
		staticUrl: "/mcp/field/filter-my.json",
		uri: McpSchema.withFieldResourceUri("filter.my"),
	},
	{
		fieldName: "filter.isFavourite",
		documentPath: "field/filter-is-favourite.json",
		staticUrl: "/mcp/field/filter-is-favourite.json",
		uri: McpSchema.withFieldResourceUri("filter.isFavourite"),
	},
	{
		fieldName: "filter.title",
		documentPath: "field/filter-title.json",
		staticUrl: "/mcp/field/filter-title.json",
		uri: McpSchema.withFieldResourceUri("filter.title"),
	},
	{
		fieldName: "filter.transaction",
		documentPath: "field/filter-transaction.json",
		staticUrl: "/mcp/field/filter-transaction.json",
		uri: McpSchema.withFieldResourceUri("filter.transaction"),
	},
	{
		fieldName: "meta.latLon",
		documentPath: "field/meta-lat-lon.json",
		staticUrl: "/mcp/field/meta-lat-lon.json",
		uri: McpSchema.withFieldResourceUri("meta.latLon"),
	},
	{
		fieldName: "meta.feedId",
		documentPath: "field/meta-feed-id.json",
		staticUrl: "/mcp/field/meta-feed-id.json",
		uri: McpSchema.withFieldResourceUri("meta.feedId"),
	},
	{
		fieldName: "sort.field",
		documentPath: "field/sort-field.json",
		staticUrl: "/mcp/field/sort-field.json",
		uri: McpSchema.withFieldResourceUri("sort.field"),
	},
	{
		fieldName: "sort.order",
		documentPath: "field/sort-order.json",
		staticUrl: "/mcp/field/sort-order.json",
		uri: McpSchema.withFieldResourceUri("sort.order"),
	},
	{
		fieldName: "s3.path",
		documentPath: "field/s3-path.json",
		staticUrl: "/mcp/field/s3-path.json",
		uri: McpSchema.withFieldResourceUri("s3.path"),
	},
	{
		fieldName: "s3.extension",
		documentPath: "field/s3-extension.json",
		staticUrl: "/mcp/field/s3-extension.json",
		uri: McpSchema.withFieldResourceUri("s3.extension"),
	},
	{
		fieldName: "s3.contentType",
		documentPath: "field/s3-content-type.json",
		staticUrl: "/mcp/field/s3-content-type.json",
		uri: McpSchema.withFieldResourceUri("s3.contentType"),
	},
	{
		fieldName: "s3.url",
		documentPath: "field/s3-url.json",
		staticUrl: "/mcp/field/s3-url.json",
		uri: McpSchema.withFieldResourceUri("s3.url"),
	},
	{
		fieldName: "s3.cdn",
		documentPath: "field/s3-cdn.json",
		staticUrl: "/mcp/field/s3-cdn.json",
		uri: McpSchema.withFieldResourceUri("s3.cdn"),
	},
	{
		fieldName: "upload.id",
		documentPath: "field/upload-id.json",
		staticUrl: "/mcp/field/upload-id.json",
		uri: McpSchema.withFieldResourceUri("upload.id"),
	},
	{
		fieldName: "upload.url",
		documentPath: "field/upload-url.json",
		staticUrl: "/mcp/field/upload-url.json",
		uri: McpSchema.withFieldResourceUri("upload.url"),
	},
] as const satisfies readonly StaticFieldResourceEntry[];

const staticDocumentByPath: Record<string, unknown> = {
	"entity/category.json": EntityCategoryJson,
	"entity/draft.json": EntityDraftJson,
	"entity/gallery.json": EntityGalleryJson,
	"entity/listing.json": EntityListingJson,
	"entity/location.json": EntityLocationJson,
	"entity/upload.json": EntityUploadJson,
	"field/category-category.json": FieldCategoryCategoryJson,
	"field/category-filter-fulltext.json": FieldCategoryFilterFulltextJson,
	"field/category-group.json": FieldCategoryGroupJson,
	"field/category-id.json": FieldCategoryIdJson,
	"field/category-id-in.json": FieldCategoryIdInJson,
	"field/category-locale.json": FieldCategoryLocaleJson,
	"field/category-locale-in.json": FieldCategoryLocaleInJson,
	"field/category-slug.json": FieldCategorySlugJson,
	"field/category-sort.json": FieldCategorySortJson,
	"field/cursor-page.json": FieldCursorPageJson,
	"field/cursor-size.json": FieldCursorSizeJson,
	"field/count-filter.json": FieldCountFilterJson,
	"field/count-is-empty.json": FieldCountIsEmptyJson,
	"field/count-is-filter-empty.json": FieldCountIsFilterEmptyJson,
	"field/count-total.json": FieldCountTotalJson,
	"field/draft-age.json": FieldDraftAgeJson,
	"field/draft-category-id.json": FieldDraftCategoryIdJson,
	"field/draft-condition.json": FieldDraftConditionJson,
	"field/draft-cons.json": FieldDraftConsJson,
	"field/draft-delivery.json": FieldDraftDeliveryJson,
	"field/draft-description.json": FieldDraftDescriptionJson,
	"field/draft-expires-at.json": FieldDraftExpiresAtJson,
	"field/draft-filter-updated-at-gte.json": FieldDraftFilterUpdatedAtGteJson,
	"field/draft-filter-updated-at-lte.json": FieldDraftFilterUpdatedAtLteJson,
	"field/draft-filter-used-at-is-null.json": FieldDraftFilterUsedAtIsNullJson,
	"field/draft-gallery.json": FieldDraftGalleryJson,
	"field/draft-id.json": FieldDraftIdJson,
	"field/draft-location-id.json": FieldDraftLocationIdJson,
	"field/draft-price-type.json": FieldDraftPriceTypeJson,
	"field/draft-price.json": FieldDraftPriceJson,
	"field/draft-pros.json": FieldDraftProsJson,
	"field/draft-restriction.json": FieldDraftRestrictionJson,
	"field/draft-sort-field.json": FieldDraftSortFieldJson,
	"field/draft-title.json": FieldDraftTitleJson,
	"field/draft-upload-ids.json": FieldDraftUploadIdsJson,
	"field/draft-used-at.json": FieldDraftUsedAtJson,
	"field/draft-warranty.json": FieldDraftWarrantyJson,
	"field/filter-age-in.json": FieldFilterAgeInJson,
	"field/filter-age-max.json": FieldFilterAgeMaxJson,
	"field/filter-age-min.json": FieldFilterAgeMinJson,
	"field/filter-category-id-in.json": FieldFilterCategoryIdInJson,
	"field/filter-category-id.json": FieldFilterCategoryIdJson,
	"field/filter-condition-in.json": FieldFilterConditionInJson,
	"field/filter-condition-max.json": FieldFilterConditionMaxJson,
	"field/filter-condition-min.json": FieldFilterConditionMinJson,
	"field/filter-currency-in.json": FieldFilterCurrencyInJson,
	"field/filter-currency.json": FieldFilterCurrencyJson,
	"field/filter-delivery-in.json": FieldFilterDeliveryInJson,
	"field/filter-expires-at-after.json": FieldFilterExpiresAtAfterJson,
	"field/filter-expires-at-before.json": FieldFilterExpiresAtBeforeJson,
	"field/filter-feed-id-in.json": FieldFilterFeedIdInJson,
	"field/filter-feed-id.json": FieldFilterFeedIdJson,
	"field/filter-fulltext.json": FieldFilterFulltextJson,
	"field/filter-id-in.json": FieldFilterIdInJson,
	"field/filter-id.json": FieldFilterIdJson,
	"field/filter-is-favourite.json": FieldFilterIsFavouriteJson,
	"field/filter-my.json": FieldFilterMyJson,
	"field/filter-price-max.json": FieldFilterPriceMaxJson,
	"field/filter-price-min.json": FieldFilterPriceMinJson,
	"field/filter-range.json": FieldFilterRangeJson,
	"field/filter-title.json": FieldFilterTitleJson,
	"field/filter-transaction.json": FieldFilterTransactionJson,
	"field/filter-user-id.json": FieldFilterUserIdJson,
	"field/filter-warranty-in.json": FieldFilterWarrantyInJson,
	"field/filter-with-ignored.json": FieldFilterWithIgnoredJson,
	"field/filter-with-own.json": FieldFilterWithOwnJson,
	"field/listing-age.json": FieldListingAgeJson,
	"field/listing-category.json": FieldListingCategoryJson,
	"field/listing-condition.json": FieldListingConditionJson,
	"field/listing-delivery.json": FieldListingDeliveryJson,
	"field/listing-distance.json": FieldListingDistanceJson,
	"field/listing-draft-id.json": FieldListingDraftIdJson,
	"field/listing-gallery.json": FieldListingGalleryJson,
	"field/listing-has-flag.json": FieldListingHasFlagJson,
	"field/listing-is-favourite.json": FieldListingIsFavouriteJson,
	"field/listing-is-ignored.json": FieldListingIsIgnoredJson,
	"field/listing-location.json": FieldListingLocationJson,
	"field/listing-my.json": FieldListingMyJson,
	"field/listing-price-type.json": FieldListingPriceTypeJson,
	"field/listing-restriction.json": FieldListingRestrictionJson,
	"field/listing-thumb.json": FieldListingThumbJson,
	"field/listing-transaction-id.json": FieldListingTransactionIdJson,
	"field/listing-upload-ids.json": FieldListingUploadIdsJson,
	"field/listing-warranty.json": FieldListingWarrantyJson,
	"field/location-address.json": FieldLocationAddressJson,
	"field/location-autocomplete-lang.json": FieldLocationAutocompleteLangJson,
	"field/location-autocomplete-text.json": FieldLocationAutocompleteTextJson,
	"field/location-city.json": FieldLocationCityJson,
	"field/location-code.json": FieldLocationCodeJson,
	"field/location-confidence.json": FieldLocationConfidenceJson,
	"field/location-country.json": FieldLocationCountryJson,
	"field/location-lang.json": FieldLocationLangJson,
	"field/location-lat.json": FieldLocationLatJson,
	"field/location-lon.json": FieldLocationLonJson,
	"field/location-query.json": FieldLocationQueryJson,
	"field/location-street.json": FieldLocationStreetJson,
	"field/location-zip.json": FieldLocationZipJson,
	"field/meta-feed-id.json": FieldMetaFeedIdJson,
	"field/meta-lat-lon.json": FieldMetaLatLonJson,
	"field/s3-cdn.json": FieldS3CdnJson,
	"field/s3-content-type.json": FieldS3ContentTypeJson,
	"field/s3-extension.json": FieldS3ExtensionJson,
	"field/s3-path.json": FieldS3PathJson,
	"field/s3-url.json": FieldS3UrlJson,
	"field/sort-field.json": FieldSortFieldJson,
	"field/sort-order.json": FieldSortOrderJson,
	"field/upload-id.json": FieldUploadIdJson,
	"field/upload-url.json": FieldUploadUrlJson,
	"guide/draft-write-flow.json": GuideDraftWriteFlowJson,
	"guide/failures.json": GuideFailuresJson,
	"guide/listing-behavior.json": GuideListingBehaviorJson,
	"guide/namespaces.json": GuideNamespacesJson,
	"guide/overview.json": GuideOverviewJson,
	"guide/query-profiles.json": GuideQueryProfilesJson,
	"guide/roles.json": GuideRolesJson,
	"guide/rules.json": GuideRulesJson,
	"guide/search-and-ranking.json": GuideSearchAndRankingJson,
	"profile/buyer-search-by-category.json": ProfileBuyerSearchByCategoryJson,
	"profile/buyer-search-by-delivery.json": ProfileBuyerSearchByDeliveryJson,
	"profile/buyer-search-favourites.json": ProfileBuyerSearchFavouritesJson,
	"profile/buyer-search-mine.json": ProfileBuyerSearchMineJson,
	"profile/buyer-search-nearby.json": ProfileBuyerSearchNearbyJson,
	"profile/seller-draft-create-complete.json": ProfileSellerDraftCreateCompleteJson,
	"profile/seller-draft-fetch-exact.json": ProfileSellerDraftFetchExactJson,
	"profile/seller-draft-gallery-replace.json": ProfileSellerDraftGalleryReplaceJson,
	"profile/seller-draft-patch-progressive.json": ProfileSellerDraftPatchProgressiveJson,
	"profile/seller-draft-review-recent.json": ProfileSellerDraftReviewRecentJson,
	"profile/seller-draft-unused.json": ProfileSellerDraftUnusedJson,
	"profile/seller-image-upload-prepare.json": ProfileSellerImagePrepareUploadJson,
	"profile/seller-listing-count-published.json": ProfileSellerListingCountPublishedJson,
	"profile/seller-listing-publish-from-draft.json": ProfileSellerListingPublishFromDraftJson,
	"profile/session-category-select.json": ProfileSessionCategorySelectJson,
	"profile/session-location-autocomplete.json": ProfileSessionLocationAutocompleteJson,
	"profile/session-location-translate-address.json": ProfileSessionLocationTranslateAddressJson,
	"schema/enum/allowed-content-type.json": SchemaEnumAllowedContentTypeJson,
	"schema/enum/allowed-extension.json": SchemaEnumAllowedExtensionJson,
	"schema/enum/currency.json": SchemaEnumCurrencyJson,
	"schema/enum/listing-delivery.json": SchemaEnumListingDeliveryJson,
	"schema/enum/listing-expire.json": SchemaEnumListingExpireJson,
	"schema/enum/listing-price.json": SchemaEnumListingPriceJson,
	"schema/enum/listing-restriction.json": SchemaEnumListingRestrictionJson,
	"schema/enum/listing-sort.json": SchemaEnumListingSortJson,
	"schema/enum/listing-warranty.json": SchemaEnumListingWarrantyJson,
	"schema/enum/thumb.json": SchemaEnumThumbJson,
};

const withDocument = (documentPath: string): StaticResourceDocument.Any => {
	const document = staticDocumentByPath[documentPath];
	if (!document) {
		throw new Error(`Unknown MCP static resource document: ${documentPath}`);
	}

	return document as StaticResourceDocument.Any;
};

const withStaticFieldResource = (fieldName: string): StaticFieldResourceEntry => {
	const resource = staticFieldResources.find((item) => item.fieldName === fieldName);
	if (!resource) {
		throw new Error(`Unknown MCP field resource: ${fieldName}`);
	}

	return resource;
};

const withStaticProfileResource = (profileName: string): StaticProfileResourceEntry => {
	const resource = staticProfileResources.find((item) => item.profileName === profileName);
	if (!resource) {
		throw new Error(`Unknown MCP profile resource: ${profileName}`);
	}

	return resource;
};

const withStaticEntityResource = (entityName: string): StaticEntityResourceEntry => {
	const resource = staticEntityResources.find((item) => item.entityName === entityName);
	if (!resource) {
		throw new Error(`Unknown MCP entity resource: ${entityName}`);
	}

	return resource;
};

const withStaticEnumResource = (enumName: string): StaticEnumResourceEntry => {
	const resource = staticEnumResources.find((item) => item.enumName === enumName);
	if (!resource) {
		throw new Error(`Unknown MCP enum resource: ${enumName}`);
	}

	return resource;
};

export const withStaticResources = (): McpResourceDefinition.Definition[] => {
	return [
		...staticResources,
		...staticProfileResources,
		...staticEntityResources,
		...staticEnumResources,
		...staticFieldResources,
	].map(({ documentPath, staticUrl, uri }) => {
		const document = withDocument(documentPath);

		return withStaticResourceDefinition({
			document,
			kind: document.kind,
			staticUrl,
			uri,
		});
	});
};

export const withStaticFieldResourceTemplate = (): McpResourceDefinition.TemplateDefinition => {
	return {
		name: "mcp-field",
		title: "Field: Template",
		description:
			"Parameterized field documentation for MCP-visible buyer, seller, session, and user fields.",
		mimeType: "application/json",
		uriTemplate: "zbav://mcp/field/{fieldName}",
		complete: {
			fieldName(value) {
				return staticFieldResources
					.map((resource) => resource.fieldName)
					.filter((fieldName) => fieldName.includes(value));
			},
		},
		list() {
			return {
				resources: [],
			};
		},
		read(uri, variables) {
			const fieldName = variables.fieldName;
			if (typeof fieldName !== "string") {
				throw new Error(`Missing MCP fieldName variable for resource: ${uri.toString()}`);
			}

			const resource = withStaticFieldResource(fieldName);
			const document = withDocument(resource.documentPath);

			return McpResourceDefinition.withContent(uri, {
				...document,
				canonicalUri: uri.toString(),
				staticUrl: resource.staticUrl,
			});
		},
	};
};

export const withStaticProfileResourceTemplate = (): McpResourceDefinition.TemplateDefinition => {
	return {
		name: "mcp-profile",
		title: "Profile: Template",
		description:
			"Parameterized query profile documentation for MCP search, draft, upload, and publish intent patterns.",
		mimeType: "application/json",
		uriTemplate: "zbav://mcp/profile/{profileName}",
		complete: {
			profileName(value) {
				return staticProfileResources
					.map((resource) => resource.profileName)
					.filter((profileName) => profileName.includes(value));
			},
		},
		list() {
			return {
				resources: [],
			};
		},
		read(uri, variables) {
			const profileName = variables.profileName;
			if (typeof profileName !== "string") {
				throw new Error(`Missing MCP profileName variable for resource: ${uri.toString()}`);
			}

			const resource = withStaticProfileResource(profileName);
			const document = withDocument(resource.documentPath);

			return McpResourceDefinition.withContent(uri, {
				...document,
				canonicalUri: uri.toString(),
				staticUrl: resource.staticUrl,
			});
		},
	};
};

export const withStaticEntityResourceTemplate = (): McpResourceDefinition.TemplateDefinition => {
	return {
		name: "mcp-entity",
		title: "Entity: Template",
		description: "Parameterized entity documentation for MCP-visible marketplace entities.",
		mimeType: "application/json",
		uriTemplate: "zbav://mcp/entity/{entityName}",
		complete: {
			entityName(value) {
				return staticEntityResources
					.map((resource) => resource.entityName)
					.filter((entityName) => entityName.includes(value));
			},
		},
		list() {
			return {
				resources: [],
			};
		},
		read(uri, variables) {
			const entityName = variables.entityName;
			if (typeof entityName !== "string") {
				throw new Error(`Missing MCP entityName variable for resource: ${uri.toString()}`);
			}

			const resource = withStaticEntityResource(entityName);
			const document = withDocument(resource.documentPath);

			return McpResourceDefinition.withContent(uri, {
				...document,
				canonicalUri: uri.toString(),
				staticUrl: resource.staticUrl,
			});
		},
	};
};

export const withStaticEnumResourceTemplate = (): McpResourceDefinition.TemplateDefinition => {
	return {
		name: "mcp-enum",
		title: "Enum: Template",
		description: "Parameterized enum documentation for MCP-visible enum families.",
		mimeType: "application/json",
		uriTemplate: "zbav://mcp/schema/enum/{enumName}",
		complete: {
			enumName(value) {
				return staticEnumResources
					.map((resource) => resource.enumName)
					.filter((enumName) => enumName.includes(value));
			},
		},
		list() {
			return {
				resources: [],
			};
		},
		read(uri, variables) {
			const enumName = variables.enumName;
			if (typeof enumName !== "string") {
				throw new Error(`Missing MCP enumName variable for resource: ${uri.toString()}`);
			}

			const resource = withStaticEnumResource(enumName);
			const document = withDocument(resource.documentPath);

			return McpResourceDefinition.withContent(uri, {
				...document,
				canonicalUri: uri.toString(),
				staticUrl: resource.staticUrl,
			});
		},
	};
};
