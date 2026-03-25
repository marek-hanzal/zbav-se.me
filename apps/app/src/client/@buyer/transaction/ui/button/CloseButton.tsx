import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionCloseMutation } from "@zbav-se.me/sdk/mutation/buyer/transaction";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/client/@common/transaction/ui/TransactionMenuButton";
import { archiveSellerMessageInbox } from "../../service/archiveSellerMessageInbox";

export namespace CloseButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
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
					path: {
						transactionId: transaction.id,
					},
					url: "/api/buyer/transaction/{transactionId}/close",
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
