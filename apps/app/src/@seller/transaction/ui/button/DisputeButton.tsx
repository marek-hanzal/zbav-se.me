import { useQueryClient } from "@tanstack/react-query";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionSchema } from "~/@seller/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/@user/transaction/ui/TransactionMenuButton";
import { withTransactionDisputeMutation } from "../../mutation/withTransactionDisputeMutation";
import { archiveBuyerMessageInbox } from "../../service/archiveBuyerMessageInbox";

export namespace DisputeButton {
	export interface Props extends ConfirmButton.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const DisputeButton: FC<DisputeButton.Props> = ({ close, transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionDisputeMutation.useMutation({
		async onPostMutation() {
			try {
				await archiveBuyerMessageInbox({
					queryClient,
					transactionId: transaction.id,
					listingId: transaction.listingId,
				});
			} catch {
				// Keep dispute flow usable even if unread archival fails.
			}

			close();
		},
	});

	return (
		<ConfirmButton
			data-ui="DisputeButton[Button]"
			iconEnabled={FlagIcon}
			confirmProps={{
				ui: {
					tone: "danger",
				},
				children: <Tx label="Dispute transaction - confirm (button)" />,
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
			<Tx label="Dispute transaction (button)" />
		</ConfirmButton>
	);
};
