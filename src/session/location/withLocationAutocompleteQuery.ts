import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { locationAutocompleteFn } from "~/session/location/fn/locationAutocompleteFn";
import type { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export const withLocationAutocompleteQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withLocationAutocompleteQuery",
	]),
	errors: {} as {
		query: locationAutocompleteFn.Error;
	},
	keys(data) {
		return [
			"location",
			"autocomplete",
			data,
		];
	},
	async queryFn(data: LocationAutocompleteSchema.Type): Promise<LocationSchema.Type[]> {
		return locationAutocompleteFn({
			data,
		});
	},
});
