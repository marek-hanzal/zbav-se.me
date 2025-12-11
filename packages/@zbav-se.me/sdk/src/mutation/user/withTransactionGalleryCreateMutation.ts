import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionGalleryCreate } from "../../api/user/sdk.gen";
import type {
	apiTransactionGalleryCreateError,
	tApiTransactionGalleryCreateResponse,
	tTransactionGalleryCreate,
} from "../../api/user/types.gen";
import { withTransactionCollectionQuery } from "../../query/user/withTransactionCollectionQuery";
import { withTransactionFetchQuery } from "../../query/user/withTransactionFetchQuery";
import { withTransactionLogCollectionQuery } from "../../query/user/withTransactionLogCollectionQuery";

export const withTransactionGalleryCreateMutation = withMutation<
	tTransactionGalleryCreate,
	tApiTransactionGalleryCreateResponse[200],
	apiTransactionGalleryCreateError
>({
	keys(variables) {
		return [
			"transaction-gallery",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionGalleryCreate({
				body,
			}),
		);
	},
	invalidate: [
		withTransactionLogCollectionQuery,
		withTransactionFetchQuery,
		withTransactionCollectionQuery,
	],
});
