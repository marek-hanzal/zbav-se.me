import { withQuery } from "@use-pico/client/query";
import { apiGithubHistory } from "../../../api/public/sdk.gen";
import type { tApiGithubHistoryResponse } from "../../../api/public/types.gen";

export const withGithubHistoryQuery = withQuery<void, tApiGithubHistoryResponse[200]>({
	keys() {
		return [
			"github",
			"history",
		];
	},
	async queryFn() {
		return apiGithubHistory({
			throwOnError: true,
		}).then((res) => res.data);
	},
});
