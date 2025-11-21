import { PostgresExtensionsMigration } from "./0000-postgres-extensions";
import { CategoryMigration } from "./0001-category";
import { CategorySpotlightMigration } from "./0002-category-spotlight";
import { CategorySeedMigration } from "./0003-category-seed";
import { LocationMigration } from "./0004-location";
import { UploadMigration } from "./0005-upload";
import { ListingMigration } from "./0006-listing";
import { GalleryMigration } from "./0007-gallery";
import { CategoryMissMigration } from "./0008-category-miss";
import { UserExMigration } from "./0009-user-ex";
import { FeedMigration } from "./0010-feed";
import { ListingCartMigration } from "./0011-listing-cart";
import { ListingScoreMigration } from "./0012-listing-score";
import { ListingIgnoreMigration } from "./0013-listing-ignore";
import { ListingFlagMigration } from "./0014-listing-flag";
import { UserScoreMigration } from "./0015-user-score";
import { ListingTransactionMigration } from "./0016-listing-transaction";
import { ListingTransactionStatusMigration } from "./0017-listing-transaction-status";
import { ListingTransactionMessageMigration } from "./0018-listing-transaction-message";
import { ListingTransactionGalleryMigration } from "./0019-listing-transaction-gallery";
import { ListingTransactionLocationMigration } from "./0020-listing-transaction-location";

export const migrations = {
	"0000-postgres-extensions": PostgresExtensionsMigration,
	"0001-category": CategoryMigration,
	"0002-category-spotlight": CategorySpotlightMigration,
	"0003-category-seed": CategorySeedMigration,
	"0004-location": LocationMigration,
	"0005-upload": UploadMigration,
	"0006-listing": ListingMigration,
	"0007-gallery": GalleryMigration,
	"0008-category-miss": CategoryMissMigration,
	"0009-user-ex": UserExMigration,
	"0010-feed": FeedMigration,
	"0011-listing-cart": ListingCartMigration,
	"0012-listing-score": ListingScoreMigration,
	"0013-listing-ignore": ListingIgnoreMigration,
	"0014-listing-flag": ListingFlagMigration,
	"0015-user-score": UserScoreMigration,
	"0016-listing-transaction": ListingTransactionMigration,
	"0017-listing-transaction-status": ListingTransactionStatusMigration,
	"0018-listing-transaction-message": ListingTransactionMessageMigration,
	"0019-listing-transaction-gallery": ListingTransactionGalleryMigration,
	"0020-listing-transaction-location": ListingTransactionLocationMigration,
} as const;
