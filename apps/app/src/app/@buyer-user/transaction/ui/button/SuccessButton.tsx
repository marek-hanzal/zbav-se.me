import { translator } from "@use-pico/common/translator";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer-user";
import { withTransactionStatusSuccessMutation } from "@zbav-se.me/sdk/mutation/buyer-user/transaction";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/transaction";
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
			label={translator.text("Mark transaction as successful (button)")}
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
