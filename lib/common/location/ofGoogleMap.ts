import type { LatLonSchema } from "./LatLonSchema";
import { ofLatLonText } from "./ofLatLonText";

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
