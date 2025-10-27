import { CategoryMigration } from "./0001-category";
import { LocationMigration } from "./0002-location";
import { UploadMigration } from "./0003-upload";
import { ListingMigration } from "./0004-listing";
import { GalleryMigration } from "./0005-gallery";

export const migrations = {
	"0001-category": CategoryMigration,
	"0002-location": LocationMigration,
	"0003-upload": UploadMigration,
	"0004-listing": ListingMigration,
	"0005-gallery": GalleryMigration,
} as const;
