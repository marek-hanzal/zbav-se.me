import { withQuery } from "@use-pico/client/query";
import { apiTransactionLogCollection } from "../../api/user/sdk.gen";
import type {
	tApiTransactionLogCollectionResponse,
	tTransactionLogQuery,
} from "../../api/user/types.gen";

export const withTransactionLogCollectionQuery = withQuery<
	tTransactionLogQuery,
	tApiTransactionLogCollectionResponse[200]
>({
	keys(variables) {
		return [
			"transaction-log",
			"collection",
			variables,
		];
	},
	async queryFn(body) {
		return apiTransactionLogCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
