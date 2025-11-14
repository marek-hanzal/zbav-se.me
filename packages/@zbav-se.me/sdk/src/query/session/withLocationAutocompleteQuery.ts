import { withQuery } from "@use-pico/client/query";
import { apiLocationAutocomplete } from "../../api/session/sdk.gen";
import type { tApiLocationAutocompleteResponse, tLocationAutocomplete } from "../../api/session/types.gen";

export const withLocationAutocompleteQuery = withQuery<tLocationAutocomplete, tApiLocationAutocompleteResponse[200]>({
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
