import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionAcceptMutation } from "../../mutation/withTransactionAcceptMutation";
import { archiveBuyerMessageInbox } from "../../service/archiveBuyerMessageInbox";

export namespace AcceptButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ close, transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionAcceptMutation.useMutation({
		async onPostMutation() {
			try {
				await archiveBuyerMessageInbox({
					queryClient,
					transactionId: transaction.id,
					listingId: transaction.listingId,
				});
			} catch {
				// Keep accept flow usable even if unread archival fails.
			}

			close();
		},
	});

	return (
		<Button
			data-ui="AcceptButton[Button]"
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
			<Tx label="Accept transaction (button)" />
		</Button>
	);
};
