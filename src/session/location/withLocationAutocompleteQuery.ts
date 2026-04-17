import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import { locationAutocompleteFn } from "~/session/location/fn/locationAutocompleteFn";
import type { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

const logger = getRootLogger([
	"query",
	"withLocationAutocompleteQuery",
]);

export const withLocationAutocompleteQuery = withQuery<
	LocationAutocompleteSchema.Type,
	LocationSchema.Type[]
>({
	keys(data) {
		return [
			"location",
			"autocomplete",
			data,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		return locationAutocompleteFn({
			data,
		});
	},
});
