import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { locationAutocompleteFn } from "~/session-location/fn/locationAutocompleteFn";
import type { LocationAutocompleteSchema } from "~/session-location/schema/LocationAutocompleteSchema";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";

export const withLocationAutocompleteQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withLocationAutocompleteQuery",
	]),
	errors: {} as {
		query: locationAutocompleteFn.Error;
	},
	keys(data: LocationAutocompleteSchema.Type) {
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
