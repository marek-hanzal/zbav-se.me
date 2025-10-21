import type { auth } from "../auth";
import type { CategorySchema } from "../category/schema/CategorySchema";
import type { CategoryGroupSchema } from "../category-group/schema/CategoryGroupSchema";
import type { GallerySchema } from "../gallery/schema/GallerySchema";
import type { ListingSchema } from "../listing/schema/ListingSchema";
import type { LocationSchema } from "../location/schema/LocationSchema";

export interface Database {
	category: CategorySchema.Type;
	category_group: CategoryGroupSchema.Type;
	listing: ListingSchema.Type;
	location: LocationSchema.Type;
	gallery: GallerySchema.Type;
	user: typeof auth.$Infer.Session.user;
}
