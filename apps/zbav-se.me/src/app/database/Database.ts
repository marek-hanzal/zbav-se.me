import type { CategorySchema } from "../category/db/CategorySchema";
import type { CategoryGroupSchema } from "../category-group/db/CategoryGroupSchema";

export interface Database {
	Category: CategorySchema.Type;
	CategoryGroup: CategoryGroupSchema.Type;
}
