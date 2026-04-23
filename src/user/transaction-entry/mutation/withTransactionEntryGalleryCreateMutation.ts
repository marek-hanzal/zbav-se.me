import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withActivityQuery } from "~/user/activity/query/withActivityQuery";
import { transactionEntryCreateFn } from "~/user/transaction-entry/fn/transactionEntryCreateFn";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";
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
	transactionEntryCreateFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withTransactionEntryGalleryCreateMutation",
	]),
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
				await Promise.all([
					withTransactionEntryQuery.invalidator(queryClient, [
						"collection",
						"count",
					]),
					withActivityQuery.invalidator(queryClient, [
						"collection",
						"count",
					]),
				]);
			},
		},
	],
});
