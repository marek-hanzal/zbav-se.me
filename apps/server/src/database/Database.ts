import type { CategorySchema } from "../category/schema/CategorySchema";
import type { CategoryGroupSchema } from "../category-group/schema/CategoryGroupSchema";

export interface Database {
	Category: CategorySchema.Type;
	CategoryGroup: CategoryGroupSchema.Type;
}
