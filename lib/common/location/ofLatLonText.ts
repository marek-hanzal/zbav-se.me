import { match } from "ts-pattern";
import type { LatLonSchema } from "./LatLonSchema";

export namespace ofLatLonText {
	export interface Props {
		mode: "map" | "text";
		latLon: LatLonSchema.Type;
	}
}

export const ofLatLonText = ({ mode, latLon }: ofLatLonText.Props) => {
	return match(mode)
		.with("map", () => {
			const precision = 5;
			return `${latLon.lat.toFixed(precision)}, ${latLon.lon.toFixed(precision)}`;
		})
		.with("text", () => {
			const precision = 5;

			const latDir = latLon.lat >= 0 ? "N" : "S";
			const lonDir = latLon.lon >= 0 ? "E" : "W";

			return `${Math.abs(latLon.lat).toFixed(precision)} ${latDir}, ${Math.abs(latLon.lon).toFixed(precision)} ${lonDir}`;
		})
		.exhaustive();
};
