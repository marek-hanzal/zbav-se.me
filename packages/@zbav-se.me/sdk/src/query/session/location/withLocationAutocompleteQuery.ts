import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiLocationAutocomplete } from "../../../api/session/sdk.gen";
import type {
	tApiLocationAutocompleteResponse,
	tLocationAutocomplete,
} from "../../../api/session/types.gen";

export const withLocationAutocompleteQuery = withQuery<
	tLocationAutocomplete,
	tApiLocationAutocompleteResponse[200]
>({
	keys(data) {
		return [
			"location",
			"autocomplete",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiLocationAutocomplete({
					body,
					headers,
				}),
			);
		},
	}),
});
