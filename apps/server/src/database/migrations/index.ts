import { PostgresExtensionsMigration } from "./0000-postgres-extensions";
import { CategoryMigration } from "./0001-category";
import { CategorySpotlightMigration } from "./0002-category-spotlight";
import { CategorySeedMigration } from "./0003-category-seed";
import { LocationMigration } from "./0004-location";
import { UploadMigration } from "./0005-upload";
import { ListingMigration } from "./0006-listing";
import { GalleryMigration } from "./0007-gallery";
import { GalleryItemMigration } from "./0008-gallery-item";
import { ListingGalleryMigration } from "./0009-listing-gallery";
import { CategoryMissMigration } from "./0010-category-miss";
import { UserExMigration } from "./0011-user-ex";
import { FeedMigration } from "./0012-feed";
import { FavouriteMigration } from "./0013-favourite";
import { ListingScoreMigration } from "./0014-listing-score";
import { IgnoreMigration } from "./0015-ignore";
import { FlagMigration } from "./0016-flag";
import { UserScoreMigration } from "./0017-user-score";
import { ListingTransactionMigration } from "./0018-listing-transaction";
import { ListingTransactionStatusMigration } from "./0019-listing-transaction-status";
import { ListingTransactionMessageMigration } from "./0020-listing-transaction-message";
import { ListingTransactionGalleryMigration } from "./0021-listing-transaction-gallery";
import { ListingTransactionLocationMigration } from "./0022-listing-transaction-location";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-category": CategoryMigration,
	"0002-category-spotlight": CategorySpotlightMigration,
	"0003-category-seed": CategorySeedMigration,
	"0004-location": LocationMigration,
	"0005-upload": UploadMigration,
	"0006-listing": ListingMigration,
	"0007-gallery": GalleryMigration,
	"0008-gallery-item": GalleryItemMigration,
	"0009-listing-gallery": ListingGalleryMigration,
	"0010-category-miss": CategoryMissMigration,
	"0011-user-ex": UserExMigration,
	"0012-feed": FeedMigration,
	"0013-favourite": FavouriteMigration,
	"0014-listing-score": ListingScoreMigration,
	"0015-ignore": IgnoreMigration,
	"0016-flag": FlagMigration,
	"0017-user-score": UserScoreMigration,
	"0018-listing-transaction": ListingTransactionMigration,
	"0019-listing-transaction-status": ListingTransactionStatusMigration,
	"0020-listing-transaction-message": ListingTransactionMessageMigration,
	"0021-listing-transaction-gallery": ListingTransactionGalleryMigration,
	"0022-listing-transaction-location": ListingTransactionLocationMigration,
} as const;
