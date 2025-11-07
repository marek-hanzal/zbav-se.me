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
} as const;
