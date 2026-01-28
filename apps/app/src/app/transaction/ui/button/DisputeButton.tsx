import { useQueryClient } from "@tanstack/react-query";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import { withTransactionStatusDisputeMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
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
			label={"Dispute transaction (button)"}
			iconEnabled={FlagIcon}
			confirmProps={{
				ui: {
					tone: "danger",
				},
				label: translator.text("Dispute transaction - confirm (button)"),
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
