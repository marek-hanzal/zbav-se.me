import { Context } from "effect";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";

export interface UserRestrictionContext {
	/**
	 * Delay in hours before the new user restriction becomes available.
	 */
	delay: Partial<Record<CategoryRestrictionEnumSchema.Type, number>>;
}

export class UserRestrictionContextFx extends Context.Tag("UserRestrictionContextFx")<
	UserRestrictionContextFx,
	UserRestrictionContext
>() {
	//
}
