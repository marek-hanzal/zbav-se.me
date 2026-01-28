import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingCreate } from "../../../api/seller-user/sdk.gen";
import type {
	apiListingCreateError,
	tApiListingCreateResponse,
	tListingCreate,
} from "../../../api/seller-user/types.gen";
import { withListingCollectionQuery } from "../../../query/buyer-session/listing/withListingCollectionQuery";
import { withListingCountQuery } from "../../../query/buyer-session/listing/withListingCountQuery";

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
