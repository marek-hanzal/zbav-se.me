import { Effect } from "effect";
import { type LocationConfig, LocationConfigFx } from "./LocationConfigFx";

export function withLocationConfigFx(config: LocationConfig) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(LocationConfigFx, config));
	};
}
