import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiDraftPatch } from "../../../api/user/sdk.gen";
import type {
	apiDraftPatchError,
	tApiDraftPatchResponse,
	tDraftPatch,
} from "../../../api/user/types.gen";
import { withDraftCollectionQuery } from "../../../query/user/draft/withDraftCollectionQuery";
import { withDraftFetchQuery } from "../../../query/user/draft/withDraftFetchQuery";

export const withDraftPatchMutation = withMutation<
	tDraftPatch,
	tApiDraftPatchResponse[200],
	apiDraftPatchError
>({
	keys(variables) {
		return [
			"draft",
			"patch",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiDraftPatch({
				body,
			}),
		);
	},
	invalidate: [
		withDraftCollectionQuery,
		withDraftFetchQuery,
	],
});
