import { withQuery } from "@use-pico/client/query";
import { apiListingScore } from "../api/session/sdk.gen";
import type { tApiListingScoreResponse } from "../api/session/types.gen";

export const withListingScoreQuery = withQuery<
	string,
	tApiListingScoreResponse[200]
>({
	keys(variables) {
		return [
			"listing",
			"score",
			variables,
		];
	},
	async queryFn(variables) {
		return apiListingScore({
			path: {
				id: variables,
			},
			throwOnError: true,
		}).then((res) => res.data);
	},
});
