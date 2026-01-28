import { PostgresExtensionsMigration } from "~/database/migrations/0000-postgres-extensions";
import { CategoryMigration } from "~/database/migrations/0001-category";
import { CategorySpotlightMigration } from "~/database/migrations/0002-category-spotlight";
import { CategorySeedMigration } from "~/database/migrations/0003-category-seed";
import { CategoryMissMigration } from "~/database/migrations/0004-category-miss";
import { LocationMigration } from "~/database/migrations/0005-location";
import { UploadMigration } from "~/database/migrations/0006-upload";
import { GalleryMigration } from "~/database/migrations/0007-gallery";
import { GalleryItemMigration } from "~/database/migrations/0008-gallery-item";
import { DraftMigration } from "~/database/migrations/0009-draft";
import { ListingMigration } from "~/database/migrations/0010-listing";
import { FeedMigration } from "~/database/migrations/0011-feed";
import { UserExMigration } from "~/database/migrations/0012-user-ex";
import { FavouriteMigration } from "~/database/migrations/0013-favourite";
import { ListingEventMigration } from "~/database/migrations/0014-listing-event";
import { IgnoreMigration } from "~/database/migrations/0015-ignore";
import { FlagMigration } from "~/database/migrations/0016-flag";
import { MessageThreadMigration } from "~/database/migrations/0017-message-thread";
import { MessageThreadUserMigration } from "~/database/migrations/0018-message-thread-user";
import { MessageTextMigration } from "~/database/migrations/0019-message-text";
import { MessageSystemMigration } from "~/database/migrations/0020-message-system";
import { MessageGalleryMigration } from "~/database/migrations/0021-message-gallery";
import { MessageLocationMigration } from "~/database/migrations/0022-message-location";
import { MessagePersonalMigration } from "~/database/migrations/0023-message-personal";
import { MessagePackageMigration } from "~/database/migrations/0024-message-package";
import { TransactionMigration } from "~/database/migrations/0025-transaction";
import { TransactionStatusMigration } from "~/database/migrations/0026-transaction-status";
import { GitHubMigration } from "~/database/migrations/0027-github";
import { ThumbMigration } from "~/database/migrations/0028-thumb";
import { UserEventMigration } from "~/database/migrations/0029-user-event";

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
	"0017-message-thread": MessageThreadMigration,
	"0018-message-thread-user": MessageThreadUserMigration,
	"0019-message-text": MessageTextMigration,
	"0020-message-system": MessageSystemMigration,
	"0021-message-gallery": MessageGalleryMigration,
	"0022-message-location": MessageLocationMigration,
	"0023-message-personal": MessagePersonalMigration,
	"0024-message-package": MessagePackageMigration,
	"0025-transaction": TransactionMigration,
	"0026-transaction-status": TransactionStatusMigration,
	"0027-github": GitHubMigration,
	"0028-thumb": ThumbMigration,
	"0029-user-event": UserEventMigration,
} as const;
