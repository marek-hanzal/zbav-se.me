import { useQueryClient } from "@tanstack/react-query";
import type { FC } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { FlagIcon } from "~/common/ui/icon";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionDisputeMutation } from "../../mutation/withTransactionDisputeMutation";
import { archiveBuyerMessageActivity } from "../../service/archiveBuyerMessageActivity";

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
				await archiveBuyerMessageActivity({
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
				"data-ui-tone": "danger",
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
