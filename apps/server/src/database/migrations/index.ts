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
import { ListingVendorModelMigration } from "./0010-listing-vendor-model";
import { FeedMigration } from "./0011-feed";
import { UserExSideMigration } from "./0012-user-ex-side";

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
	"0010-listing-vendor-model": ListingVendorModelMigration,
	"0011-feed": FeedMigration,
	"0012-user-ex-side": UserExSideMigration,
} as const;
