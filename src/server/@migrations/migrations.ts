import { PostgresExtensionsMigration } from "~/server/@migrations/0000-postgres-extensions";
import { AccessMigration } from "~/server/@migrations/0001-access";
import { RestrictionMigration } from "~/server/@migrations/0002-restriction";
import { FieldMigration } from "~/server/@migrations/0003-field";
import { FieldOptionMigration } from "~/server/@migrations/0004-field-option";
import { AttrLocationMigration } from "~/server/@migrations/0005-attr-location";
import { AttrNumberMigration } from "~/server/@migrations/0006-attr-number";
import { AttrDecimalMigration } from "~/server/@migrations/0007-attr-decimal";
import { AttrTextMigration } from "~/server/@migrations/0008-attr-text";
import { AttrEnumSingleMigration } from "~/server/@migrations/0009-attr-enum-single";
import { AttrEnumMultiMigration } from "~/server/@migrations/0010-attr-enum-multi";
import { CategoryMigration } from "~/server/@migrations/0011-category";
import { CategoryFieldMigration } from "~/server/@migrations/0012-category-field";
import { CategorySpotlightMigration } from "~/server/@migrations/0013-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0014-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0015-category-miss";
import { LocationMigration } from "~/server/@migrations/0016-location";
import { UploadMigration } from "~/server/@migrations/0017-upload";
import { GalleryMigration } from "~/server/@migrations/0018-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0019-gallery-item";
import { ListingMigration } from "~/server/@migrations/0020-listing";
import { FeedMigration } from "~/server/@migrations/0021-feed";
import { UserExMigration } from "~/server/@migrations/0022-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0023-favourite";
import { ListingEventMigration } from "~/server/@migrations/0024-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0025-ignore";
import { FlagMigration } from "~/server/@migrations/0026-flag";
import { TransactionMigration } from "~/server/@migrations/0027-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0028-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0029-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0030-github";
import { ThumbMigration } from "~/server/@migrations/0031-thumb";
import { UserEventMigration } from "~/server/@migrations/0032-user-event";
import { ActivityMigration } from "~/server/@migrations/0033-activity";
import { AgentThreadMigration } from "~/server/@migrations/0034-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0035-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0036-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0037-user-restriction";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-access": AccessMigration,
	"0002-restriction": RestrictionMigration,
	"0003-field": FieldMigration,
	"0004-field-option": FieldOptionMigration,
	"0005-attr-location": AttrLocationMigration,
	"0006-attr-number": AttrNumberMigration,
	"0007-attr-decimal": AttrDecimalMigration,
	"0008-attr-text": AttrTextMigration,
	"0009-attr-enum-single": AttrEnumSingleMigration,
	"0010-attr-enum-multi": AttrEnumMultiMigration,
	"0011-category": CategoryMigration,
	"0012-category-field": CategoryFieldMigration,
	"0013-category-spotlight": CategorySpotlightMigration,
	"0014-category-seed": CategorySeedMigration,
	"0015-category-miss": CategoryMissMigration,
	"0016-location": LocationMigration,
	"0017-upload": UploadMigration,
	"0018-gallery": GalleryMigration,
	"0019-gallery-item": GalleryItemMigration,
	"0020-listing": ListingMigration,
	"0021-feed": FeedMigration,
	"0022-user-ex": UserExMigration,
	"0023-favourite": FavouriteMigration,
	"0024-listing-event": ListingEventMigration,
	"0025-ignore": IgnoreMigration,
	"0026-flag": FlagMigration,
	"0027-transaction": TransactionMigration,
	"0028-transaction-entry": TransactionEntryMigration,
	"0029-transaction-user": TransactionUserMigration,
	"0030-github": GitHubMigration,
	"0031-thumb": ThumbMigration,
	"0032-user-event": UserEventMigration,
	"0033-activity": ActivityMigration,
	"0034-agent-thread": AgentThreadMigration,
	"0035-agent-stream": AgentStreamMigration,
	"0036-agent-usage": AgentUsageMigration,
	"0037-user-restriction": UserRestrictionMigration,
};
