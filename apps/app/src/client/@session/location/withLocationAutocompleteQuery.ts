import { withQuery } from "@use-pico/client/query";
import { locationAutocompleteFn } from "~/server/@session/location/fn/locationAutocompleteFn";
import type { LocationAutocompleteSchema } from "~/server/@session/location/schema/LocationAutocompleteSchema";
import type { LocationSchema } from "~/server/@session/location/schema/LocationSchema";

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
		return locationAutocompleteFn({
			data,
		});
	},
});
