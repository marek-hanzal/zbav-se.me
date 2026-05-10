import { PostgresExtensionsMigration } from "~/server/@migrations/0000-postgres-extensions";
import { EnumMigration } from "~/server/@migrations/0001-enum";
import { RestrictionMigration } from "~/server/@migrations/0002-restriction";
import { FieldMigration } from "~/server/@migrations/0003-field";
import { FieldOptionMigration } from "~/server/@migrations/0004-field-option";
import { FieldSeedMigration } from "~/server/@migrations/0005-field-seed";
import { CategoryMigration } from "~/server/@migrations/0006-category";
import { CategoryFieldMigration } from "~/server/@migrations/0007-category-field";
import { CategorySpotlightMigration } from "~/server/@migrations/0008-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0009-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0010-category-miss";
import { LocationMigration } from "~/server/@migrations/0011-location";
import { UploadMigration } from "~/server/@migrations/0012-upload";
import { GalleryMigration } from "~/server/@migrations/0013-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0014-gallery-item";
import { DraftMigration } from "~/server/@migrations/0015-draft";
import { DraftAttrNumberMigration } from "~/server/@migrations/0016-draft-attr-number";
import { DraftAttrDecimalMigration } from "~/server/@migrations/0017-draft-attr-decimal";
import { DraftAttrTextMigration } from "~/server/@migrations/0018-draft-attr-text";
import { DraftAttrEnumSingleMigration } from "~/server/@migrations/0019-draft-attr-enum-single";
import { DraftAttrEnumMultiMigration } from "~/server/@migrations/0020-draft-attr-enum-multi";
import { ListingMigration } from "~/server/@migrations/0021-listing";
import { ListingAttrNumberMigration } from "~/server/@migrations/0022-listing-attr-number";
import { ListingAttrDecimalMigration } from "~/server/@migrations/0023-listing-attr-decimal";
import { ListingAttrTextMigration } from "~/server/@migrations/0024-listing-attr-text";
import { ListingAttrEnumSingleMigration } from "~/server/@migrations/0025-listing-attr-enum-single";
import { ListingAttrEnumMultiMigration } from "~/server/@migrations/0026-listing-attr-enum-multi";
import { FeedMigration } from "~/server/@migrations/0027-feed";
import { UserExMigration } from "~/server/@migrations/0028-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0029-favourite";
import { ListingEventMigration } from "~/server/@migrations/0030-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0031-ignore";
import { FlagMigration } from "~/server/@migrations/0032-flag";
import { TransactionMigration } from "~/server/@migrations/0033-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0034-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0035-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0036-github";
import { ThumbMigration } from "~/server/@migrations/0037-thumb";
import { UserEventMigration } from "~/server/@migrations/0038-user-event";
import { ActivityMigration } from "~/server/@migrations/0039-activity";
import { AgentThreadMigration } from "~/server/@migrations/0040-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0041-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0042-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0043-user-restriction";
import { TranslationMigration } from "~/server/@migrations/0044-translation";
import { ListingSpotlightMigration } from "~/server/@migrations/0045-listing-spotlight";

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
};
