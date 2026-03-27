import { withQuery } from "@use-pico/client/query";
import { locationFetchFn } from "~/session/location/server/fn/locationFetchFn";
import type { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

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
