import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionEntryCreate } from "../../../api/user/sdk.gen";
import type {
	apiTransactionEntryCreateError,
	tApiTransactionEntryCreateResponse,
} from "../../../api/user/types.gen";
import { withTransactionEntryQuery } from "../../../query/user/transaction-entry";

export namespace withTransactionMessageGalleryCreateMutation {
	export interface Props {
		transactionId: string;
		uploadIds: string[];
	}
}

export const withTransactionMessageGalleryCreateMutation = withMutation<
	withTransactionMessageGalleryCreateMutation.Props,
	tApiTransactionEntryCreateResponse[201],
	apiTransactionEntryCreateError
>({
	keys(variables) {
		return [
			"transaction-message-gallery",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionEntryCreate({
				body: {
					transactionId: body.transactionId,
					kind: "gallery",
					payload: {
						uploadIds: body.uploadIds,
					},
				},
			}),
		);
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await withTransactionEntryQuery.invalidator(queryClient, [
					"collection",
					"count",
				]);
			},
		},
	],
});
