import { CategoryGroupMigration } from "./0001-category-group";
import { CategoryMigration } from "./0002-category";
import { LocationMigration } from "./0003-location";
import { UploadMigration } from "./0004-upload";
import { ListingMigration } from "./0005-listing";
import { GalleryMigration } from "./0006-gallery";

export const migrations = {
	"0001-category-group": CategoryGroupMigration,
	"0002-category": CategoryMigration,
	"0003-location": LocationMigration,
	"0004-upload": UploadMigration,
	"0005-listing": ListingMigration,
	"0006-gallery": GalleryMigration,
} as const;
