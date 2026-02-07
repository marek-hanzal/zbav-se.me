import { Effect } from "effect";
import type { LocationContext } from "~/@session/location/context/LocationContextFx";
import { LocationContextLayer } from "~/@session/location/context/LocationContextLayer";

export const withLocationFx =
	(context: LocationContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provide(LocationContextLayer(context)));
