import { withQuery } from "@use-pico/client/query";
import { locationFetchFn } from "~/server/@session/location/fn/locationFetchFn";
import type { LocationQuerySchema } from "~/server/@session/location/schema/LocationQuerySchema";
import type { LocationSchema } from "~/server/@session/location/schema/LocationSchema";

export const withLocationFetchQuery = withQuery<LocationQuerySchema.Type, LocationSchema.Type>({
	keys(data) {
		return [
			"location",
			"fetch",
			data,
		];
	},
	async queryFn(data) {
		return locationFetchFn({
			data,
		});
	},
});
