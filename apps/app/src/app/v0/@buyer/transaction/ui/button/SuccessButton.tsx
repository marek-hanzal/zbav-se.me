import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionStatusSuccessMutation } from "@zbav-se.me/sdk/mutation/buyer/transaction";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace SuccessButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const SuccessButton: FC<SuccessButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusSuccessMutation.useMutation();

	return (
		<Button
			data-ui="SuccessButton[Button]"
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate(
					{
						transactionId: transaction.id,
					},
					{
						onSuccess() {
							withTransactionQuery.invalidator(
								queryClient,
								[
									"fetch",
								],
								{
									fetch: {
										where: {
											id: transaction.id,
										},
									},
								},
							);
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
		>
			<Tx label="Mark transaction as successful (button)" />
		</Button>
	);
};
