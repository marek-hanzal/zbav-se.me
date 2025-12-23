import { PostgresExtensionsMigration } from "./0000-postgres-extensions";
import { CategoryMigration } from "./0001-category";
import { CategorySpotlightMigration } from "./0002-category-spotlight";
import { CategorySeedMigration } from "./0003-category-seed";
import { CategoryMissMigration } from "./0004-category-miss";
import { LocationMigration } from "./0005-location";
import { UploadMigration } from "./0006-upload";
import { GalleryMigration } from "./0007-gallery";
import { GalleryItemMigration } from "./0008-gallery-item";
import { DraftMigration } from "./0009-draft";
import { ListingMigration } from "./0010-listing";
import { FeedMigration } from "./0011-feed";
import { UserExMigration } from "./0012-user-ex";
import { FavouriteMigration } from "./0013-favourite";
import { ListingEventMigration } from "./0014-listing-event";
import { IgnoreMigration } from "./0015-ignore";
import { FlagMigration } from "./0016-flag";
import { UserScoreMigration } from "./0017-user-score";
import { MessageThreadMigration } from "./0018-message-thread";
import { MessageThreadUserMigration } from "./0019-message-thread-user";
import { MessageTextMigration } from "./0020-message-text";
import { MessageSystemMigration } from "./0021-message-system";
import { MessageGalleryMigration } from "./0022-message-gallery";
import { MessageLocationMigration } from "./0023-message-location";
import { TransactionMigration } from "./0024-transaction";
import { TransactionStatusMigration } from "./0025-transaction-status";
import { GitHubMigration } from "./0026-github";
import { FeedbackMigration } from "./0027-feedback";

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
	"0017-user-score": UserScoreMigration,
	"0018-message-thread": MessageThreadMigration,
	"0019-message-thread-user": MessageThreadUserMigration,
	"0020-message-text": MessageTextMigration,
	"0021-message-system": MessageSystemMigration,
	"0022-message-gallery": MessageGalleryMigration,
	"0023-message-location": MessageLocationMigration,
	"0024-transaction": TransactionMigration,
	"0025-transaction-status": TransactionStatusMigration,
	"0026-github": GitHubMigration,
	"0027-feedback": FeedbackMigration,
} as const;
