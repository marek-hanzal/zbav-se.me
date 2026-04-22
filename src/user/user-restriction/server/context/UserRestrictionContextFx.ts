import { Context } from "effect";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export interface UserRestrictionContext {
	/**
	 * Delay in hours before the new user restriction becomes available.
	 */
	delay: Partial<Record<RestrictionEnumSchema.Type, number>>;
}

export class UserRestrictionContextFx extends Context.Tag("UserRestrictionContextFx")<
	UserRestrictionContextFx,
	UserRestrictionContext
>() {
	//
}
