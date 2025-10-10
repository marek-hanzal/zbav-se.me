import type { CategoryGroupSchema, CategorySchema } from "@zbav-se.me/common";

export interface Database {
	Category: CategorySchema.Type;
	CategoryGroup: CategoryGroupSchema.Type;
}
