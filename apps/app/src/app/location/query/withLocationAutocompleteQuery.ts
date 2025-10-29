import { withQuery } from "@use-pico/client";
import {
	type ApiLocationAutocompleteParams,
	apiLocationAutocomplete,
	type LocationDto,
} from "@zbav-se.me/sdk";

export const withLocationAutocompleteQuery = withQuery<
	ApiLocationAutocompleteParams,
	LocationDto[]
>({
	keys(data) {
		return [
			"location",
			"autocomplete",
			data,
		];
	},
	async queryFn(data) {
		return apiLocationAutocomplete(data).then((res) => res.data);
	},
});
