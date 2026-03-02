import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import { withTransactionStatusCloseMutation } from "@zbav-se.me/sdk/mutation/buyer-user/transaction";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user/message-thread";
import type { FC } from "react";

export namespace CloseButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const CloseButton: FC<CloseButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusCloseMutation.useMutation();

	return (
		<Button
			data-ui="CloseButton[Button]"
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
			<Tx label="Close transaction (button)" />
		</Button>
	);
};
