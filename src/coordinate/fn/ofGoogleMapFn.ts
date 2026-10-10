import { ofLatLonTextFn } from "~/coordinate/fn/ofLatLonTextFn";
import type { LatLonSchema } from "~/coordinate/schema/LatLonSchema";

export namespace ofGoogleMapFn {
	export interface Props {
		latLon: LatLonSchema.Type;
	}
}

export const ofGoogleMapFn = ({ latLon }: ofGoogleMapFn.Props) => {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
		ofLatLonTextFn({
			mode: "map",
			latLon,
		}),
	)}`;
};
