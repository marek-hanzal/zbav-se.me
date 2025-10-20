import type { CategorySchema } from "../category/schema/CategorySchema";
import type { CategoryGroupSchema } from "../category-group/schema/CategoryGroupSchema";
import type { GallerySchema } from "../gallery/schema/GallerySchema";
import type { ListingSchema } from "../listing/schema/ListingSchema";
import type { LocationSchema } from "../location/schema/LocationSchema";

export interface Database {
	Category: CategorySchema.Type;
	CategoryGroup: CategoryGroupSchema.Type;
	Listing: ListingSchema.Type;
	Location: LocationSchema.Type;
	Gallery: GallerySchema.Type;
}
