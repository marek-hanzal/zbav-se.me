import { PostgresExtensionsMigration } from "~/server/@migrations/0000-postgres-extensions";
import { AccessMigration } from "~/server/@migrations/0001-access";
import { RestrictionMigration } from "~/server/@migrations/0002-restriction";
import { FieldMigration } from "~/server/@migrations/0003-field";
import { AttrNumberMigration } from "~/server/@migrations/0004-attr-number";
import { CategoryMigration } from "~/server/@migrations/0005-category";
import { CategoryFieldMigration } from "~/server/@migrations/0006-category-field";
import { CategorySpotlightMigration } from "~/server/@migrations/0007-category-spotlight";
import { CategorySeedMigration } from "~/server/@migrations/0008-category-seed";
import { CategoryMissMigration } from "~/server/@migrations/0009-category-miss";
import { LocationMigration } from "~/server/@migrations/0010-location";
import { UploadMigration } from "~/server/@migrations/0011-upload";
import { GalleryMigration } from "~/server/@migrations/0012-gallery";
import { GalleryItemMigration } from "~/server/@migrations/0013-gallery-item";
import { DraftMigration } from "~/server/@migrations/0014-draft";
import { ListingMigration } from "~/server/@migrations/0015-listing";
import { FeedMigration } from "~/server/@migrations/0016-feed";
import { UserExMigration } from "~/server/@migrations/0017-user-ex";
import { FavouriteMigration } from "~/server/@migrations/0018-favourite";
import { ListingEventMigration } from "~/server/@migrations/0019-listing-event";
import { IgnoreMigration } from "~/server/@migrations/0020-ignore";
import { FlagMigration } from "~/server/@migrations/0021-flag";
import { TransactionMigration } from "~/server/@migrations/0022-transaction";
import { TransactionEntryMigration } from "~/server/@migrations/0023-transaction-entry";
import { TransactionUserMigration } from "~/server/@migrations/0024-transaction-user";
import { GitHubMigration } from "~/server/@migrations/0025-github";
import { ThumbMigration } from "~/server/@migrations/0026-thumb";
import { UserEventMigration } from "~/server/@migrations/0027-user-event";
import { ActivityMigration } from "~/server/@migrations/0028-activity";
import { AgentThreadMigration } from "~/server/@migrations/0029-agent-thread";
import { AgentStreamMigration } from "~/server/@migrations/0030-agent-stream";
import { AgentUsageMigration } from "~/server/@migrations/0031-agent-usage";
import { UserRestrictionMigration } from "~/server/@migrations/0032-user-restriction";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-access": AccessMigration,
	"0002-restriction": RestrictionMigration,
	"0003-field": FieldMigration,
	"0004-attr-number": AttrNumberMigration,
	"0005-category": CategoryMigration,
	"0006-category-field": CategoryFieldMigration,
	"0007-category-spotlight": CategorySpotlightMigration,
	"0008-category-seed": CategorySeedMigration,
	"0009-category-miss": CategoryMissMigration,
	"0010-location": LocationMigration,
	"0011-upload": UploadMigration,
	"0012-gallery": GalleryMigration,
	"0013-gallery-item": GalleryItemMigration,
	"0014-draft": DraftMigration,
	"0015-listing": ListingMigration,
	"0016-feed": FeedMigration,
	"0017-user-ex": UserExMigration,
	"0018-favourite": FavouriteMigration,
	"0019-listing-event": ListingEventMigration,
	"0020-ignore": IgnoreMigration,
	"0021-flag": FlagMigration,
	"0022-transaction": TransactionMigration,
	"0023-transaction-entry": TransactionEntryMigration,
	"0024-transaction-user": TransactionUserMigration,
	"0025-github": GitHubMigration,
	"0026-thumb": ThumbMigration,
	"0027-user-event": UserEventMigration,
	"0028-activity": ActivityMigration,
	"0029-agent-thread": AgentThreadMigration,
	"0030-agent-stream": AgentStreamMigration,
	"0031-agent-usage": AgentUsageMigration,
	"0032-user-restriction": UserRestrictionMigration,
};
