import { PostgresExtensionsMigration } from "~/server/@migrations/0000-postgres-extensions";
import { AccessMigration } from "~/server/@migrations/0001-access";
import { RestrictionMigration } from "~/server/@migrations/0002-restriction";
import { CategoryMigration } from "~/server/@migrations/0003-category";
import { CategorySpotlightMigration } from "~/server/@migrations/0004-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0005-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0006-category-miss";
import { LocationMigration } from "~/server/@migrations/0007-location";
import { UploadMigration } from "~/server/@migrations/0008-upload";
import { GalleryMigration } from "~/server/@migrations/0009-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0010-gallery-item";
import { DraftMigration } from "~/server/@migrations/0011-draft";
import { ListingMigration } from "~/server/@migrations/0012-listing";
import { FeedMigration } from "~/server/@migrations/0013-feed";
import { UserExMigration } from "~/server/@migrations/0014-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0015-favourite";
import { ListingEventMigration } from "~/server/@migrations/0016-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0017-ignore";
import { FlagMigration } from "~/server/@migrations/0018-flag";
import { TransactionMigration } from "~/server/@migrations/0019-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0020-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0021-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0022-github";
import { ThumbMigration } from "~/server/@migrations/0023-thumb";
import { UserEventMigration } from "~/server/@migrations/0024-user-event";
import { ActivityMigration } from "~/server/@migrations/0025-activity";
import { AgentThreadMigration } from "~/server/@migrations/0026-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0027-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0028-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0029-user-restriction";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-access": AccessMigration,
	"0002-restriction": RestrictionMigration,
	"0003-category": CategoryMigration,
	"0004-category-spotlight": CategorySpotlightMigration,
	"0005-category-seed": CategorySeedMigration,
	"0006-category-miss": CategoryMissMigration,
	"0007-location": LocationMigration,
	"0008-upload": UploadMigration,
	"0009-gallery": GalleryMigration,
	"0010-gallery-item": GalleryItemMigration,
	"0011-draft": DraftMigration,
	"0012-listing": ListingMigration,
	"0013-feed": FeedMigration,
	"0014-user-ex": UserExMigration,
	"0015-favourite": FavouriteMigration,
	"0016-listing-event": ListingEventMigration,
	"0017-ignore": IgnoreMigration,
	"0018-flag": FlagMigration,
	"0019-transaction": TransactionMigration,
	"0020-transaction-entry": TransactionEntryMigration,
	"0021-transaction-user": TransactionUserMigration,
	"0022-github": GitHubMigration,
	"0023-thumb": ThumbMigration,
	"0024-user-event": UserEventMigration,
	"0025-activity": ActivityMigration,
	"0026-agent-thread": AgentThreadMigration,
	"0027-agent-stream": AgentStreamMigration,
	"0028-agent-usage": AgentUsageMigration,
	"0029-user-restriction": UserRestrictionMigration,
} as const;
