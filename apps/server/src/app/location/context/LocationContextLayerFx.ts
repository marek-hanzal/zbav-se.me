import { type Effect, Layer } from "effect";
import { type LocationContext, LocationContextFx } from "~/app/location/context/LocationContextFx";

export const LocationContextLayerFx = <E, R>(contextFx: Effect.Effect<LocationContext, E, R>) => {
	return Layer.effect(LocationContextFx, contextFx);
};
