import { Effect } from "effect";
import { type LocationConfig, LocationConfigFx } from "~/session-location/context/LocationConfigFx";

export function withLocationConfigFn(config: LocationConfig) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(LocationConfigFx, config));
	};
}
