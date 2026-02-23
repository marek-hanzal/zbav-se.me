import { useQueryClient } from "@tanstack/react-query";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller-user";
import { withTransactionStatusRejectMutation } from "@zbav-se.me/sdk/mutation/seller-user/transaction-status";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/seller-user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace RejectButton {
	export interface Props extends Partial<ConfirmButton.Props> {
		transaction: tTransaction;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusRejectMutation.useMutation();

	return (
		<ConfirmButton
			data-ui="RejectButton[ConfirmButton]"
			label={translator.text("Reject transaction (button)")}
			iconEnabled={CancelIcon}
			confirmProps={{
				ui: {
					tone: "danger",
				},
				label: translator.text("Reject transaction - confirm (button)"),
				onClick() {
					mutation.mutate(
						{
							transactionId: transaction.id,
						},
						{
							onSuccess() {
								withTransactionFetchQuery.invalidate(queryClient, {
									where: {
										id: transaction.id,
									},
								});
								withMessageThreadMessageCollectionQuery.invalidate(queryClient, {
									path: {
										messageThreadId: transaction.messageThreadId,
									},
								});
							},
						},
					);
				},
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		/>
	);
};
