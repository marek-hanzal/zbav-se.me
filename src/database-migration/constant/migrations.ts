import { PostgresExtensionsMigration } from "~/database-migration/migration/0000-postgres-extensions";
import { EnumMigration } from "~/database-migration/migration/0001-enum";
import { RestrictionMigration } from "~/database-migration/migration/0002-restriction";
import { FieldMigration } from "~/database-migration/migration/0003-field";
import { FieldOptionMigration } from "~/database-migration/migration/0004-field-option";
import { FieldSeedMigration } from "~/database-migration/migration/0005-field-seed";
import { CategoryMigration } from "~/database-migration/migration/0006-category";
import { CategoryFieldMigration } from "~/database-migration/migration/0007-category-field";
import { CategorySpotlightMigration } from "~/database-migration/migration/0008-category-spotlight";
import { CategorySeedMigration } from "~/database-migration/migration/0009-category-seed";
import { CategoryMissMigration } from "~/database-migration/migration/0010-category-miss";
import { LocationMigration } from "~/database-migration/migration/0011-location";
import { UploadMigration } from "~/database-migration/migration/0012-upload";
import { GalleryMigration } from "~/database-migration/migration/0013-gallery";
import { GalleryItemMigration } from "~/database-migration/migration/0014-gallery-item";
import { DraftMigration } from "~/database-migration/migration/0015-draft";
import { DraftAttrNumberMigration } from "~/database-migration/migration/0016-draft-attr-number";
import { DraftAttrDecimalMigration } from "~/database-migration/migration/0017-draft-attr-decimal";
import { DraftAttrTextMigration } from "~/database-migration/migration/0018-draft-attr-text";
import { DraftAttrEnumSingleMigration } from "~/database-migration/migration/0019-draft-attr-enum-single";
import { DraftAttrEnumMultiMigration } from "~/database-migration/migration/0020-draft-attr-enum-multi";
import { ListingMigration } from "~/database-migration/migration/0021-listing";
import { ListingAttrNumberMigration } from "~/database-migration/migration/0022-listing-attr-number";
import { ListingAttrDecimalMigration } from "~/database-migration/migration/0023-listing-attr-decimal";
import { ListingAttrTextMigration } from "~/database-migration/migration/0024-listing-attr-text";
import { ListingAttrEnumSingleMigration } from "~/database-migration/migration/0025-listing-attr-enum-single";
import { ListingAttrEnumMultiMigration } from "~/database-migration/migration/0026-listing-attr-enum-multi";
import { FeedMigration } from "~/database-migration/migration/0027-feed";
import { UserExMigration } from "~/database-migration/migration/0028-user-ex";
import { FavouriteMigration } from "~/database-migration/migration/0029-favourite";
import { ListingEventMigration } from "~/database-migration/migration/0030-listing-event";
import { IgnoreMigration } from "~/database-migration/migration/0031-ignore";
import { FlagMigration } from "~/database-migration/migration/0032-flag";
import { TransactionMigration } from "~/database-migration/migration/0033-transaction";
import { TransactionEntryMigration } from "~/database-migration/migration/0034-transaction-entry";
import { TransactionUserMigration } from "~/database-migration/migration/0035-transaction-user";
import { GitHubMigration } from "~/database-migration/migration/0036-github";
import { ThumbMigration } from "~/database-migration/migration/0037-thumb";
import { UserEventMigration } from "~/database-migration/migration/0038-user-event";
import { ActivityMigration } from "~/database-migration/migration/0039-activity";
import { AgentThreadMigration } from "~/database-migration/migration/0040-agent-thread";
import { AgentStreamMigration } from "~/database-migration/migration/0041-agent-stream";
import { AgentUsageMigration } from "~/database-migration/migration/0042-agent-usage";
import { UserRestrictionMigration } from "~/database-migration/migration/0043-user-restriction";
import { TranslationMigration } from "~/database-migration/migration/0044-translation";
import { ListingSpotlightMigration } from "~/database-migration/migration/0045-listing-spotlight";
import { RateLimitRuleMigration } from "~/database-migration/migration/0046-rate-limit-rule";
import { RateLimitEventMigration } from "~/database-migration/migration/0047-rate-limit-event";
import { ResourceDefinitionMigration } from "~/database-migration/migration/0048-resource-definition";
import { ResourceBundleMigration } from "~/database-migration/migration/0049-resource-bundle";
import { ResourceBundleLimitMigration } from "~/database-migration/migration/0050-resource-bundle-limit";
import { ResourceBundleItemMigration } from "~/database-migration/migration/0051-resource-bundle-item";
import { ResourceBundleFeatureMigration } from "~/database-migration/migration/0052-resource-bundle-feature";
import { UserResourceBundleMigration } from "~/database-migration/migration/0053-user-resource-bundle";
import { UserResourceBundleLimitMigration } from "~/database-migration/migration/0054-user-resource-bundle-limit";
import { UserResourceBundleItemMigration } from "~/database-migration/migration/0055-user-resource-bundle-item";
import { UserResourceBundleFeatureMigration } from "~/database-migration/migration/0056-user-resource-bundle-feature";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-enum": EnumMigration,
	"0002-restriction": RestrictionMigration,
	"0003-field": FieldMigration,
	"0004-field-option": FieldOptionMigration,
	"0005-field-seed": FieldSeedMigration,
	"0006-category": CategoryMigration,
	"0007-category-field": CategoryFieldMigration,
	"0008-category-spotlight": CategorySpotlightMigration,
	"0009-category-seed": CategorySeedMigration,
	"0010-category-miss": CategoryMissMigration,
	"0011-location": LocationMigration,
	"0012-upload": UploadMigration,
	"0013-gallery": GalleryMigration,
	"0014-gallery-item": GalleryItemMigration,
	"0015-draft": DraftMigration,
	"0016-draft-attr-number": DraftAttrNumberMigration,
	"0017-draft-attr-decimal": DraftAttrDecimalMigration,
	"0018-draft-attr-text": DraftAttrTextMigration,
	"0019-draft-attr-enum-single": DraftAttrEnumSingleMigration,
	"0020-draft-attr-enum-multi": DraftAttrEnumMultiMigration,
	"0021-listing": ListingMigration,
	"0022-listing-attr-number": ListingAttrNumberMigration,
	"0023-listing-attr-decimal": ListingAttrDecimalMigration,
	"0024-listing-attr-text": ListingAttrTextMigration,
	"0025-listing-attr-enum-single": ListingAttrEnumSingleMigration,
	"0026-listing-attr-enum-multi": ListingAttrEnumMultiMigration,
	"0027-feed": FeedMigration,
	"0028-user-ex": UserExMigration,
	"0029-favourite": FavouriteMigration,
	"0030-listing-event": ListingEventMigration,
	"0031-ignore": IgnoreMigration,
	"0032-flag": FlagMigration,
	"0033-transaction": TransactionMigration,
	"0034-transaction-entry": TransactionEntryMigration,
	"0035-transaction-user": TransactionUserMigration,
	"0036-github": GitHubMigration,
	"0037-thumb": ThumbMigration,
	"0038-user-event": UserEventMigration,
	"0039-activity": ActivityMigration,
	"0040-agent-thread": AgentThreadMigration,
	"0041-agent-stream": AgentStreamMigration,
	"0042-agent-usage": AgentUsageMigration,
	"0043-user-restriction": UserRestrictionMigration,
	"0044-translation": TranslationMigration,
	"0045-listing-spotlight": ListingSpotlightMigration,
	"0046-rate-limit-rule": RateLimitRuleMigration,
	"0047-rate-limit-event": RateLimitEventMigration,
	"0048-resource-definition": ResourceDefinitionMigration,
	"0049-resource-bundle": ResourceBundleMigration,
	"0050-resource-bundle-limit": ResourceBundleLimitMigration,
	"0051-resource-bundle-item": ResourceBundleItemMigration,
	"0052-resource-bundle-feature": ResourceBundleFeatureMigration,
	"0053-user-resource-bundle": UserResourceBundleMigration,
	"0054-user-resource-bundle-limit": UserResourceBundleLimitMigration,
	"0055-user-resource-bundle-item": UserResourceBundleItemMigration,
	"0056-user-resource-bundle-feature": UserResourceBundleFeatureMigration,
};
