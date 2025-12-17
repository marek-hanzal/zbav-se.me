import { withQuery } from "@use-pico/client/query";
import { apiGithubHistory } from "../../../api/public/sdk.gen";
import type {
	tApiGithubHistoryRequest,
	tApiGithubHistoryResponse,
} from "../../../api/public/types.gen";

export const withGithubHistoryQuery = withQuery<
	tApiGithubHistoryRequest["query"],
	tApiGithubHistoryResponse[200]
>({
	keys(data) {
		const weeks = data?.weeks ?? 12;
		return [
			"github",
			"history",
			weeks,
		];
	},
	async queryFn(data) {
		const weeks = data?.weeks ?? 12;
		return apiGithubHistory({
			query: {
				weeks,
			},
			throwOnError: true,
		}).then((res) => res.data);
	},
});
