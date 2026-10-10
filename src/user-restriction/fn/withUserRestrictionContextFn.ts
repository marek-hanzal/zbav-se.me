import { Effect } from "effect";
import {
	type UserRestrictionContext,
	UserRestrictionContextFx,
} from "~/user-restriction/context/UserRestrictionContextFx";

export function withUserRestrictionContextFn(context?: Partial<UserRestrictionContext>) {
	const resolvedContext: UserRestrictionContext = {
		delay: {
			adult: 1,
			sensitive: 2,
			restricted: 24,
			...context?.delay,
		},
		...context,
	};

	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(UserRestrictionContextFx, resolvedContext));
	};
}
