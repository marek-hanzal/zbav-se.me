import type { CategoryMissSchema } from "../category/schema/CategoryMissSchema";
import type { CategorySchema } from "../category/schema/CategorySchema";
import type { CategorySpotlightSchema } from "../category/schema/CategorySpotlightSchema";
import type { GallerySchema } from "../gallery/schema/GallerySchema";
import type { ListingSchema } from "../listing/schema/ListingSchema";
import type { LocationSchema } from "../location/schema/LocationSchema";
import type { UploadSchema } from "../upload/schema/UploadSchema";
import type { UserExSchema } from "../user-ex/schema/UserExSchema";

export interface Database {
	category: CategorySchema.Type;
	category_miss: CategoryMissSchema.Type;
	category_spotlight: CategorySpotlightSchema.Type;
	listing: ListingSchema.Type;
	location: LocationSchema.Type;
	gallery: GallerySchema.Type;
	upload: UploadSchema.Type;
	// user: typeof auth.$Infer.Session.user;
	user_ex: UserExSchema.Type;
}
