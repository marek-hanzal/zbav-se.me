import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { locationFetchFn } from "~/session/location/fn/locationFetchFn";
import type { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

const logger = getRootLogger([
	"query",
	"withLocationFetchQuery",
]);

export const withLocationFetchQuery = withQuery<LocationQuerySchema.Type, LocationSchema.Type>({
	keys(data) {
		return [
			"location",
			"fetch",
			data,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		return locationFetchFn({
			data,
		});
	},
});
