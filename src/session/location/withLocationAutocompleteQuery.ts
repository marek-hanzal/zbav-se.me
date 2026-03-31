import { withQuery } from "@/lib/client/query";
import { locationAutocompleteFn } from "~/session/location/server/fn/locationAutocompleteFn";
import type { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";
import type { LocationSchema } from "~/session/location/server/schema/LocationSchema";

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
