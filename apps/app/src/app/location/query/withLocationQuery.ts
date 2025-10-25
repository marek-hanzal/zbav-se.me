import { withQuery } from "@use-pico/client";
import {
	type ApiLocationAutocompleteParams,
	apiLocationAutocomplete,
	type Location,
} from "@zbav-se.me/sdk";

export const withLocationQuery = withQuery<
	ApiLocationAutocompleteParams,
	Location[]
>({
	keys(data) {
		return [
			"location",
			data,
		];
	},
	async queryFn(data) {
		return apiLocationAutocomplete(data).then((res) => res.data);
	},
});
