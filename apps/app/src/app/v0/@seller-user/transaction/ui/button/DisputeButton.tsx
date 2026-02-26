import { useQueryClient } from "@tanstack/react-query";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller-user";
import { withTransactionStatusDisputeMutation } from "@zbav-se.me/sdk/mutation/seller-user/transaction-status";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller-user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace DisputeButton {
	export interface Props extends ConfirmButton.Props {
		transaction: tTransaction;
	}
}

export const DisputeButton: FC<DisputeButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusDisputeMutation.useMutation();

	return (
		<ConfirmButton
			data-ui="DisputeButton[Button]"
			iconEnabled={FlagIcon}
			confirmProps={{
				ui: {
					tone: "danger",
				},
				children: <Tx label="Dispute transaction - confirm (button)" />,
				onClick() {
					mutation.mutate(
						{
							transactionId: transaction.id,
						},
						{
							onSuccess() {
								withTransactionQuery.invalidateQuery(queryClient, transaction.id);
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
		>
			<Tx label="Dispute transaction (button)" />
		</ConfirmButton>
	);
};
