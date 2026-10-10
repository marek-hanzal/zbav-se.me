import { ofLatLonText } from "~/coordinate/fn/ofLatLonText";
import type { LatLonSchema } from "~/coordinate/schema/LatLonSchema";

export namespace ofGoogleMap {
	export interface Props {
		latLon: LatLonSchema.Type;
	}
}

export const ofGoogleMap = ({ latLon }: ofGoogleMap.Props) => {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		ofLatLonText({
			mode: "map",
			latLon,
		}),
	)}`;
};
