import { withQuery } from "@use-pico/client/query";
import { apiTransactionCollection } from "../../../api/buyer/sdk.gen";
import type {
	tApiTransactionCollectionResponse,
	tTransactionQuery,
} from "../../../api/buyer/types.gen";

export const withTransactionCollectionQuery = withQuery<
	tTransactionQuery,
	tApiTransactionCollectionResponse[200]
>({
	keys(variables) {
		return [
			"transaction",
			"collection",
			variables,
		];
	},
	async queryFn(body) {
		return apiTransactionCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
