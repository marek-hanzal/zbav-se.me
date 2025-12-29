import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { tTransaction } from "@zbav-se.me/sdk/api/user";
import { withTransactionStatusCloseMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
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
			label={"Close transaction (button)"}
			iconEnabled={CheckIcon}
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
