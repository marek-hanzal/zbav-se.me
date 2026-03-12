import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionRejectMutation } from "@zbav-se.me/sdk/mutation/buyer/transaction";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";

export namespace RejectButton {
	export interface Props extends Partial<ConfirmButton.Props> {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionRejectMutation.useMutation({
		onSuccess() {
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
						path: {
							transactionId: transaction.id,
						},
						url: "/api/buyer/transaction/{transactionId}/reject",
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
