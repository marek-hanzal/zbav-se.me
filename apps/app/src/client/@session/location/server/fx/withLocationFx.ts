import { Effect } from "effect";
import {
	type LocationContext,
	LocationContextFx,
} from "~/client/@session/location/server/context/LocationContextFx";

export const withLocationFx =
	(context: LocationContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provideService(LocationContextFx, context));
