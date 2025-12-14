import { PostgresExtensionsMigration } from "./0000-postgres-extensions";
import { CategoryMigration } from "./0001-category";
import { CategorySpotlightMigration } from "./0002-category-spotlight";
import { CategorySeedMigration } from "./0003-category-seed";
import { LocationMigration } from "./0004-location";
import { UploadMigration } from "./0005-upload";
import { ListingMigration } from "./0006-listing";
import { DraftMigration } from "./0007-draft";
import { GalleryMigration } from "./0008-gallery";
import { GalleryItemMigration } from "./0009-gallery-item";
import { ListingGalleryMigration } from "./0010-listing-gallery";
import { DraftGalleryMigration } from "./0011-draft-gallery";
import { CategoryMissMigration } from "./0012-category-miss";
import { FeedMigration } from "./0013-feed";
import { UserExMigration } from "./0014-user-ex";
import { FavouriteMigration } from "./0015-favourite";
import { ListingScoreMigration } from "./0016-listing-score";
import { IgnoreMigration } from "./0017-ignore";
import { FlagMigration } from "./0018-flag";
import { UserScoreMigration } from "./0019-user-score";
import { MessageThreadMigration } from "./0020-message-thread";
import { MessageThreadUserMigration } from "./0021-message-thread-user";
import { MessageTextMigration } from "./0022-message-text";
import { MessageGalleryMigration } from "./0023-message-gallery";
import { MessageLocationMigration } from "./0024-message-location";
import { TransactionMigration } from "./0025-transaction";
import { TransactionStatusMigration } from "./0026-transaction-status";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-category": CategoryMigration,
	"0002-category-spotlight": CategorySpotlightMigration,
	"0003-category-seed": CategorySeedMigration,
	"0004-location": LocationMigration,
	"0005-upload": UploadMigration,
	"0006-listing": ListingMigration,
	"0007-draft": DraftMigration,
	"0008-gallery": GalleryMigration,
	"0009-gallery-item": GalleryItemMigration,
	"0010-listing-gallery": ListingGalleryMigration,
	"0011-draft-gallery": DraftGalleryMigration,
	"0012-category-miss": CategoryMissMigration,
	"0013-feed": FeedMigration,
	"0014-user-ex": UserExMigration,
	"0015-favourite": FavouriteMigration,
	"0016-listing-score": ListingScoreMigration,
	"0017-ignore": IgnoreMigration,
	"0018-flag": FlagMigration,
	"0019-user-score": UserScoreMigration,
	"0020-message-thread": MessageThreadMigration,
	"0021-message-thread-user": MessageThreadUserMigration,
	"0022-message-text": MessageTextMigration,
	"0023-message-gallery": MessageGalleryMigration,
	"0024-message-location": MessageLocationMigration,
	"0025-transaction": TransactionMigration,
	"0026-transaction-status": TransactionStatusMigration,
} as const;
