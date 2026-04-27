import { PostgresExtensionsMigration } from "~/server/@migrations/0000-postgres-extensions";
import { AccessMigration } from "~/server/@migrations/0001-access";
import { RestrictionMigration } from "~/server/@migrations/0002-restriction";
import { FieldMigration } from "~/server/@migrations/0003-field";
import { AttrNumberMigration } from "~/server/@migrations/0004-attr-number";
import { AttrDecimalMigration } from "~/server/@migrations/0005-attr-decimal";
import { CategoryMigration } from "~/server/@migrations/0025-category";
import { CategoryFieldMigration } from "~/server/@migrations/0026-category-field";
import { CategorySpotlightMigration } from "~/server/@migrations/0027-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0028-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0029-category-miss";
import { LocationMigration } from "~/server/@migrations/0030-location";
import { UploadMigration } from "~/server/@migrations/0031-upload";
import { GalleryMigration } from "~/server/@migrations/0032-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0033-gallery-item";
import { DraftMigration } from "~/server/@migrations/0034-draft";
import { ListingMigration } from "~/server/@migrations/0035-listing";
import { FeedMigration } from "~/server/@migrations/0036-feed";
import { UserExMigration } from "~/server/@migrations/0037-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0038-favourite";
import { ListingEventMigration } from "~/server/@migrations/0039-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0040-ignore";
import { FlagMigration } from "~/server/@migrations/0041-flag";
import { TransactionMigration } from "~/server/@migrations/0042-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0043-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0044-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0045-github";
import { ThumbMigration } from "~/server/@migrations/0046-thumb";
import { UserEventMigration } from "~/server/@migrations/0047-user-event";
import { ActivityMigration } from "~/server/@migrations/0048-activity";
import { AgentThreadMigration } from "~/server/@migrations/0049-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0050-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0051-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0052-user-restriction";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-access": AccessMigration,
	"0002-restriction": RestrictionMigration,
	"0003-field": FieldMigration,
	"0004-attr-number": AttrNumberMigration,
	"0005-attr-decimal": AttrDecimalMigration,
	"0025-category": CategoryMigration,
	"0026-category-field": CategoryFieldMigration,
	"0027-category-spotlight": CategorySpotlightMigration,
	"0028-category-seed": CategorySeedMigration,
	"0029-category-miss": CategoryMissMigration,
	"0030-location": LocationMigration,
	"0031-upload": UploadMigration,
	"0032-gallery": GalleryMigration,
	"0033-gallery-item": GalleryItemMigration,
	"0034-draft": DraftMigration,
	"0035-listing": ListingMigration,
	"0036-feed": FeedMigration,
	"0037-user-ex": UserExMigration,
	"0038-favourite": FavouriteMigration,
	"0039-listing-event": ListingEventMigration,
	"0040-ignore": IgnoreMigration,
	"0041-flag": FlagMigration,
	"0042-transaction": TransactionMigration,
	"0043-transaction-entry": TransactionEntryMigration,
	"0044-transaction-user": TransactionUserMigration,
	"0045-github": GitHubMigration,
	"0046-thumb": ThumbMigration,
	"0047-user-event": UserEventMigration,
	"0048-activity": ActivityMigration,
	"0049-agent-thread": AgentThreadMigration,
	"0050-agent-stream": AgentStreamMigration,
	"0051-agent-usage": AgentUsageMigration,
	"0052-user-restriction": UserRestrictionMigration,
};
