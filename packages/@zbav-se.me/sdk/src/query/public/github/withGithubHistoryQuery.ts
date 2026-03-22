import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
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
		return [
			"github",
			"history",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(data, headers) {
			return withApi(
				apiGithubHistory({
					query: data,
					headers,
				}),
			);
		},
	}),
});
