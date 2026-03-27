import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionSchema } from "~/@buyer/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/@user/transaction/ui/TransactionMenuButton";
import { withTransactionSuccessMutation } from "../../mutation/withTransactionSuccessMutation";
import { archiveSellerMessageInbox } from "../../service/archiveSellerMessageInbox";

export namespace SuccessButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
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
					id: transaction.id,
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
