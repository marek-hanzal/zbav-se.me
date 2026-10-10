import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { locationAutocompleteFn } from "~/session-location/fn/locationAutocompleteFn";
import type { LocationAutocompleteSchema } from "~/session-location/schema/LocationAutocompleteSchema";
import type { LocationSchema } from "~/session-location/schema/LocationSchema";

export const withLocationAutocompleteQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withLocationAutocompleteQuery",
	]),
	errors: {} as {
		query: locationAutocompleteFn.Error;
	},
	keysFn(data: LocationAutocompleteSchema.Type) {
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
