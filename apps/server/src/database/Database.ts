import type { CategorySchema } from "../category/schema/CategorySchema";
import type { CategoryGroupSchema } from "../category-group/schema/CategoryGroupSchema";
import type { LocationSchema } from "../location/schema/LocationSchema";

export interface Database {
	Category: CategorySchema.Type;
	CategoryGroup: CategoryGroupSchema.Type;
	Location: LocationSchema.Type;
}
