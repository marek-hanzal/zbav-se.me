import { withQuery } from "@use-pico/client";
import {
	apiLocationAutocomplete,
	type tLocationAutocomplete,
	type tLocationDto,
} from "@zbav-se.me/sdk";

export const withLocationAutocompleteQuery = withQuery<
	tLocationAutocomplete,
	tLocationDto[]
>({
	keys(data) {
		return [
			"location",
			"autocomplete",
			data,
		];
	},
	async queryFn(body) {
		return apiLocationAutocomplete({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
