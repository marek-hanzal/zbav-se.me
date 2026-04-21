import { PostgresExtensionsMigration } from "~/server/@migrations/0000-postgres-extensions";
import { CategoryMigration } from "~/server/@migrations/0001-category";
import { CategorySpotlightMigration } from "~/server/@migrations/0002-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0003-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0004-category-miss";
import { LocationMigration } from "~/server/@migrations/0005-location";
import { UploadMigration } from "~/server/@migrations/0006-upload";
import { GalleryMigration } from "~/server/@migrations/0007-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0008-gallery-item";
import { DraftMigration } from "~/server/@migrations/0009-draft";
import { ListingMigration } from "~/server/@migrations/0010-listing";
import { FeedMigration } from "~/server/@migrations/0011-feed";
import { UserExMigration } from "~/server/@migrations/0012-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0013-favourite";
import { ListingEventMigration } from "~/server/@migrations/0014-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0015-ignore";
import { FlagMigration } from "~/server/@migrations/0016-flag";
import { TransactionMigration } from "~/server/@migrations/0017-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0018-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0019-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0020-github";
import { ThumbMigration } from "~/server/@migrations/0021-thumb";
import { UserEventMigration } from "~/server/@migrations/0022-user-event";
import { ActivityMigration } from "~/server/@migrations/0023-activity";
import { AgentThreadMigration } from "~/server/@migrations/0024-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0025-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0026-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0027-user-restriction";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-category": CategoryMigration,
	"0002-category-spotlight": CategorySpotlightMigration,
	"0003-category-seed": CategorySeedMigration,
	"0004-category-miss": CategoryMissMigration,
	"0005-location": LocationMigration,
	"0006-upload": UploadMigration,
	"0007-gallery": GalleryMigration,
	"0008-gallery-item": GalleryItemMigration,
	"0009-draft": DraftMigration,
	"0010-listing": ListingMigration,
	"0011-feed": FeedMigration,
	"0012-user-ex": UserExMigration,
	"0013-favourite": FavouriteMigration,
	"0014-listing-event": ListingEventMigration,
	"0015-ignore": IgnoreMigration,
	"0016-flag": FlagMigration,
	"0017-transaction": TransactionMigration,
	"0018-transaction-entry": TransactionEntryMigration,
	"0019-transaction-user": TransactionUserMigration,
	"0020-github": GitHubMigration,
	"0021-thumb": ThumbMigration,
	"0022-user-event": UserEventMigration,
	"0023-activity": ActivityMigration,
	"0024-agent-thread": AgentThreadMigration,
	"0025-agent-stream": AgentStreamMigration,
	"0026-agent-usage": AgentUsageMigration,
	"0027-user-restriction": UserRestrictionMigration,
} as const;
