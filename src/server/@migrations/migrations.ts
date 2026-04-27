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
import { CategoryMigration } from "~/server/@migrations/0027-category";
import { CategoryFieldMigration } from "~/server/@migrations/0028-category-field";
import { CategorySpotlightMigration } from "~/server/@migrations/0029-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0030-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0031-category-miss";
import { LocationMigration } from "~/server/@migrations/0032-location";
import { UploadMigration } from "~/server/@migrations/0033-upload";
import { GalleryMigration } from "~/server/@migrations/0034-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0035-gallery-item";
import { ListingMigration } from "~/server/@migrations/0036-listing";
import { FeedMigration } from "~/server/@migrations/0037-feed";
import { UserExMigration } from "~/server/@migrations/0038-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0039-favourite";
import { ListingEventMigration } from "~/server/@migrations/0040-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0041-ignore";
import { FlagMigration } from "~/server/@migrations/0042-flag";
import { TransactionMigration } from "~/server/@migrations/0043-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0044-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0045-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0046-github";
import { ThumbMigration } from "~/server/@migrations/0047-thumb";
import { UserEventMigration } from "~/server/@migrations/0048-user-event";
import { ActivityMigration } from "~/server/@migrations/0049-activity";
import { AgentThreadMigration } from "~/server/@migrations/0050-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0051-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0052-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0053-user-restriction";

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
	"0027-category": CategoryMigration,
	"0028-category-field": CategoryFieldMigration,
	"0029-category-spotlight": CategorySpotlightMigration,
	"0030-category-seed": CategorySeedMigration,
	"0031-category-miss": CategoryMissMigration,
	"0032-location": LocationMigration,
	"0033-upload": UploadMigration,
	"0034-gallery": GalleryMigration,
	"0035-gallery-item": GalleryItemMigration,
	"0036-listing": ListingMigration,
	"0037-feed": FeedMigration,
	"0038-user-ex": UserExMigration,
	"0039-favourite": FavouriteMigration,
	"0040-listing-event": ListingEventMigration,
	"0041-ignore": IgnoreMigration,
	"0042-flag": FlagMigration,
	"0043-transaction": TransactionMigration,
	"0044-transaction-entry": TransactionEntryMigration,
	"0045-transaction-user": TransactionUserMigration,
	"0046-github": GitHubMigration,
	"0047-thumb": ThumbMigration,
	"0048-user-event": UserEventMigration,
	"0049-activity": ActivityMigration,
	"0050-agent-thread": AgentThreadMigration,
	"0051-agent-stream": AgentStreamMigration,
	"0052-agent-usage": AgentUsageMigration,
	"0053-user-restriction": UserRestrictionMigration,
};
