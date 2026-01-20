import { Layer } from "effect";
import { type LocationContext, LocationContextFx } from "~/app/location/context/LocationContextFx";

export const LocationContextLayer = (context: LocationContext) => {
	return Layer.succeed(LocationContextFx, context);
};
