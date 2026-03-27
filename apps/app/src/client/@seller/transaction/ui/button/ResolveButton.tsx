import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionSchema } from "~/client/@seller/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/client/@user/transaction/ui/TransactionMenuButton";
import { withTransactionResolveMutation } from "../../mutation/withTransactionResolveMutation";
import { archiveBuyerMessageInbox } from "../../service/archiveBuyerMessageInbox";

export namespace ResolveButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const ResolveButton: FC<ResolveButton.Props> = ({ close, transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionResolveMutation.useMutation({
		async onPostMutation() {
			try {
				await archiveBuyerMessageInbox({
					queryClient,
					transactionId: transaction.id,
					listingId: transaction.listingId,
				});
			} catch {
				// Keep resolve flow usable even if unread archival fails.
			}

			close();
		},
	});

	return (
		<Button
			data-ui="ResolveButton[Button]"
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
			<Tx label="Resolve transaction (button)" />
		</Button>
	);
};
