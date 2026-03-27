import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import type { TransactionSchema } from "~/@buyer/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/@user/transaction/ui/TransactionMenuButton";
import { withTransactionCloseMutation } from "../../mutation/withTransactionCloseMutation";
import { archiveSellerMessageInbox } from "../../service/archiveSellerMessageInbox";

export namespace CloseButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const CloseButton: FC<CloseButton.Props> = ({ close, transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionCloseMutation.useMutation({
		async onPostMutation() {
			try {
				await archiveSellerMessageInbox({
					queryClient,
					transactionId: transaction.id,
				});
			} catch {
				// Keep close flow usable even if unread archival fails.
			}

			close();
		},
	});

	return (
		<Button
			data-ui="CloseButton[Button]"
			data-action={"close transaction"}
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
			<Tx label="Close transaction (button)" />
		</Button>
	);
};
