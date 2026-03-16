import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionSuccessMutation } from "@zbav-se.me/sdk/mutation/buyer/transaction";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";
import { archiveSellerMessageInbox } from "../../service/archiveSellerMessageInbox";

export namespace SuccessButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const SuccessButton: FC<SuccessButton.Props> = ({ close, transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionSuccessMutation.useMutation({
		async onPostMutation() {
			try {
				await archiveSellerMessageInbox({
					queryClient,
					transactionId: transaction.id,
				});
			} catch {
				// Keep success flow usable even if unread archival fails.
			}

			close();
		},
	});

	return (
		<Button
			data-ui="SuccessButton[Button]"
			data-action={"mark transaction successful"}
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate({
					path: {
						transactionId: transaction.id,
					},
					url: "/api/buyer/transaction/{transactionId}/success",
				});
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		>
			<Tx label="Mark transaction as successful (button)" />
		</Button>
	);
};
