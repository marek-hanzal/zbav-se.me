import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import { withTransactionStatusDisputeMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace DisputeButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const DisputeButton: FC<DisputeButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusDisputeMutation.useMutation();

	return (
		<Button
			data-ui="DisputeButton[Button]"
			label={"Dispute transaction (button)"}
			iconEnabled={FlagIcon}
			onClick={() => {
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
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		/>
	);
};
