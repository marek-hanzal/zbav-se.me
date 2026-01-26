import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingCreate } from "../../../api/session/sdk.gen";
import type {
	apiListingCreateError,
	tApiListingCreateResponse,
	tListingCreate,
} from "../../../api/session/types.gen";
import { withListingCollectionQuery } from "../../../query/user/listing/withListingCollectionQuery";
import { withListingCountQuery } from "../../../query/user/listing/withListingCountQuery";

export const withListingCreateMutation = withMutation<
	tListingCreate,
	tApiListingCreateResponse[201],
	apiListingCreateError
>({
	keys() {
		return [
			"listing",
			"create",
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingCreate({
				body,
			}),
		);
	},
	invalidate: [
		withListingCollectionQuery,
		withListingCountQuery,
	],
});
