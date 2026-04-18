import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { locationFetchFn } from "~/session/location/fn/locationFetchFn";
import type { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";

export const withLocationFetchQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withLocationFetchQuery",
	]),
	errors: {} as {
		query: locationFetchFn.Error;
	},
	keys(data) {
		return [
			"location",
			"fetch",
			data,
		];
	},
	async queryFn(data: LocationQuerySchema.Type) {
		return locationFetchFn({
			data,
		});
	},
});
