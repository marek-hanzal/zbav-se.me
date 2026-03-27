import { withMutation } from "@use-pico/client/mutation";
import { transactionEntryCreateFn } from "~/@user/transaction-entry/server/fn/transactionEntryCreateFn";
import type { TransactionEntrySchema } from "~/@user/transaction-entry/server/schema/TransactionEntrySchema";
import { withTransactionEntryQuery } from "../query/withTransactionEntryQuery";

export namespace withTransactionEntryGalleryCreateMutation {
	export interface Props {
		transactionId: string;
		uploadIds: string[];
	}
}

export const withTransactionEntryGalleryCreateMutation = withMutation<
	withTransactionEntryGalleryCreateMutation.Props,
	TransactionEntrySchema.Type,
	Error
>({
	keys(variables) {
		return [
			"transaction-entry",
			"gallery",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return transactionEntryCreateFn({
			data: {
				transactionId: body.transactionId,
				kind: "gallery",
				payload: {
					uploadIds: body.uploadIds,
				},
			},
		});
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
