import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { withTransactionDisputeMutation } from "@zbav-se.me/sdk/mutation/seller/transaction";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";

export namespace DisputeButton {
	export interface Props extends ConfirmButton.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const DisputeButton: FC<DisputeButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionDisputeMutation.useMutation({
		onSuccess() {
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
						path: {
							transactionId: transaction.id,
						},
						url: "/api/seller/transaction/{transactionId}/dispute",
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
