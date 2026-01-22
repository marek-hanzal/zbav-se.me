import { Layer } from "effect";
import { type LocationContext, LocationContextFx } from "~/@session/location/context/LocationContextFx";

export const LocationContextLayer = (context: LocationContext) => {
	return Layer.succeed(LocationContextFx, context);
};
