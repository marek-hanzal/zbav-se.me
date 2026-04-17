import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { locationFetchFn } from "~/session/location/fn/locationFetchFn";
import type { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export const withLocationFetchQuery = withQuery<LocationQuerySchema.Type, LocationSchema.Type>({
	logger: getRootLogger([
		"query",
		"withLocationFetchQuery",
	]),
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
