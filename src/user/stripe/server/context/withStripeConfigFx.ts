import { Effect } from "effect";
import { type StripeConfig, StripeConfigFx } from "./StripeConfigFx";

export function withStripeConfigFx(config: StripeConfig) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(StripeConfigFx, config));
	};
}
