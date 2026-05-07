import { Effect } from "effect";
import {
	type LocationContext,
	LocationContextFx,
} from "~/session/location/server/context/LocationContextFx";

export function withLocationFx(context: LocationContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(LocationContextFx, context));
	};
}
