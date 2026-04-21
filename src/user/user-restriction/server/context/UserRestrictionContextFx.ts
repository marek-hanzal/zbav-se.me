import { Context } from "effect";

export interface UserRestrictionContext {
	/**
	 * Delay in hours before the new user restriction becomes available.
	 */
	delay: number;
}

export class UserRestrictionContextFx extends Context.Tag("UserRestrictionContextFx")<
	UserRestrictionContextFx,
	UserRestrictionContext
>() {
	//
}
