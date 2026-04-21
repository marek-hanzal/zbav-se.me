import { Effect } from "effect";
import {
	type UserRestrictionContext,
	UserRestrictionContextFx,
} from "~/user/user-restriction/server/context/UserRestrictionContextFx";

export function withUserRestrictionContextFx(context?: Partial<UserRestrictionContext>) {
	const resolvedContext: UserRestrictionContext = {
		delay: 24,
		...context,
	};

	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(UserRestrictionContextFx, resolvedContext));
	};
}
