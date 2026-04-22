import { PostgresExtensionsMigration } from "~/server/@migrations/0000-postgres-extensions";
import { RestrictionMigration } from "~/server/@migrations/0001-restriction";
import { CategoryMigration } from "~/server/@migrations/0002-category";
import { CategorySpotlightMigration } from "~/server/@migrations/0003-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0004-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0005-category-miss";
import { LocationMigration } from "~/server/@migrations/0006-location";
import { UploadMigration } from "~/server/@migrations/0007-upload";
import { GalleryMigration } from "~/server/@migrations/0008-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0009-gallery-item";
import { DraftMigration } from "~/server/@migrations/0010-draft";
import { ListingMigration } from "~/server/@migrations/0011-listing";
import { FeedMigration } from "~/server/@migrations/0012-feed";
import { UserExMigration } from "~/server/@migrations/0013-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0014-favourite";
import { ListingEventMigration } from "~/server/@migrations/0015-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0016-ignore";
import { FlagMigration } from "~/server/@migrations/0017-flag";
import { TransactionMigration } from "~/server/@migrations/0018-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0019-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0020-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0021-github";
import { ThumbMigration } from "~/server/@migrations/0022-thumb";
import { UserEventMigration } from "~/server/@migrations/0023-user-event";
import { ActivityMigration } from "~/server/@migrations/0024-activity";
import { AgentThreadMigration } from "~/server/@migrations/0025-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0026-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0027-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0028-user-restriction";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-restriction": RestrictionMigration,
	"0002-category": CategoryMigration,
	"0003-category-spotlight": CategorySpotlightMigration,
	"0004-category-seed": CategorySeedMigration,
	"0005-category-miss": CategoryMissMigration,
	"0006-location": LocationMigration,
	"0007-upload": UploadMigration,
	"0008-gallery": GalleryMigration,
	"0009-gallery-item": GalleryItemMigration,
	"0010-draft": DraftMigration,
	"0011-listing": ListingMigration,
	"0012-feed": FeedMigration,
	"0013-user-ex": UserExMigration,
	"0014-favourite": FavouriteMigration,
	"0015-listing-event": ListingEventMigration,
	"0016-ignore": IgnoreMigration,
	"0017-flag": FlagMigration,
	"0018-transaction": TransactionMigration,
	"0019-transaction-entry": TransactionEntryMigration,
	"0020-transaction-user": TransactionUserMigration,
	"0021-github": GitHubMigration,
	"0022-thumb": ThumbMigration,
	"0023-user-event": UserEventMigration,
	"0024-activity": ActivityMigration,
	"0025-agent-thread": AgentThreadMigration,
	"0026-agent-stream": AgentStreamMigration,
	"0027-agent-usage": AgentUsageMigration,
	"0028-user-restriction": UserRestrictionMigration,
} as const;
