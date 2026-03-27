import { useQueryClient } from "@tanstack/react-query";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionSchema } from "~/@seller/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/@user/transaction/ui/TransactionMenuButton";
import { withTransactionRejectMutation } from "../../mutation/withTransactionRejectMutation";
import { archiveBuyerMessageInbox } from "../../service/archiveBuyerMessageInbox";

export namespace RejectButton {
	export interface Props extends Partial<ConfirmButton.Props> {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ close, transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionRejectMutation.useMutation({
		async onPostMutation() {
			try {
				await archiveBuyerMessageInbox({
					queryClient,
					transactionId: transaction.id,
					listingId: transaction.listingId,
				});
			} catch {
				// Keep reject flow usable even if unread archival fails.
			}

			close();
		},
	});

	return (
		<ConfirmButton
			data-ui="RejectButton[ConfirmButton]"
			iconEnabled={CancelIcon}
			confirmProps={{
				ui: {
					tone: "danger",
				},
				children: <Tx label="Reject transaction - confirm (button)" />,
				onClick() {
					mutation.mutate({
						id: transaction.id,
					});
				},
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		>
			<Tx label="Reject transaction (button)" />
		</ConfirmButton>
	);
};
