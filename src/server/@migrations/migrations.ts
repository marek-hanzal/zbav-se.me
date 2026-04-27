import { PostgresExtensionsMigration } from "~/server/@migrations/0000-postgres-extensions";
import { AccessMigration } from "~/server/@migrations/0001-access";
import { RestrictionMigration } from "~/server/@migrations/0002-restriction";
import { FieldMigration } from "~/server/@migrations/0003-field";
import { AttrMigration } from "~/server/@migrations/0004-attr";
import { CategoryMigration } from "~/server/@migrations/0005-category";
import { CategorySpotlightMigration } from "~/server/@migrations/0006-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0007-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0008-category-miss";
import { LocationMigration } from "~/server/@migrations/0009-location";
import { UploadMigration } from "~/server/@migrations/0010-upload";
import { GalleryMigration } from "~/server/@migrations/0011-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0012-gallery-item";
import { DraftMigration } from "~/server/@migrations/0013-draft";
import { ListingMigration } from "~/server/@migrations/0014-listing";
import { FeedMigration } from "~/server/@migrations/0015-feed";
import { UserExMigration } from "~/server/@migrations/0016-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0017-favourite";
import { ListingEventMigration } from "~/server/@migrations/0018-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0019-ignore";
import { FlagMigration } from "~/server/@migrations/0020-flag";
import { TransactionMigration } from "~/server/@migrations/0021-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0022-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0023-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0024-github";
import { ThumbMigration } from "~/server/@migrations/0025-thumb";
import { UserEventMigration } from "~/server/@migrations/0026-user-event";
import { ActivityMigration } from "~/server/@migrations/0027-activity";
import { AgentThreadMigration } from "~/server/@migrations/0028-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0029-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0030-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0031-user-restriction";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-access": AccessMigration,
	"0002-restriction": RestrictionMigration,
	"0003-field": FieldMigration,
	"0004-attr": AttrMigration,
	"0005-category": CategoryMigration,
	"0006-category-spotlight": CategorySpotlightMigration,
	"0007-category-seed": CategorySeedMigration,
	"0008-category-miss": CategoryMissMigration,
	"0009-location": LocationMigration,
	"0010-upload": UploadMigration,
	"0011-gallery": GalleryMigration,
	"0012-gallery-item": GalleryItemMigration,
	"0013-draft": DraftMigration,
	"0014-listing": ListingMigration,
	"0015-feed": FeedMigration,
	"0016-user-ex": UserExMigration,
	"0017-favourite": FavouriteMigration,
	"0018-listing-event": ListingEventMigration,
	"0019-ignore": IgnoreMigration,
	"0020-flag": FlagMigration,
	"0021-transaction": TransactionMigration,
	"0022-transaction-entry": TransactionEntryMigration,
	"0023-transaction-user": TransactionUserMigration,
	"0024-github": GitHubMigration,
	"0025-thumb": ThumbMigration,
	"0026-user-event": UserEventMigration,
	"0027-activity": ActivityMigration,
	"0028-agent-thread": AgentThreadMigration,
	"0029-agent-stream": AgentStreamMigration,
	"0030-agent-usage": AgentUsageMigration,
	"0031-user-restriction": UserRestrictionMigration,
};
