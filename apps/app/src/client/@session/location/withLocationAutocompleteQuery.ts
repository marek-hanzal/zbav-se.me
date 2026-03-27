import { withQuery } from "@use-pico/client/query";
import { locationAutocompleteFn } from "~/client/@session/location/server/fn/locationAutocompleteFn";
import type { LocationAutocompleteSchema } from "~/client/@session/location/server/schema/LocationAutocompleteSchema";
import type { LocationSchema } from "~/client/@session/location/server/schema/LocationSchema";

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
