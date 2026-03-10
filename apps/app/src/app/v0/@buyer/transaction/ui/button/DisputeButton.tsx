import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionDisputeMutation } from "@zbav-se.me/sdk/mutation/buyer/transaction";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace DisputeButton {
	export interface Props extends ConfirmButton.Props {
		transaction: tTransaction;
	}
}

export const DisputeButton: FC<DisputeButton.Props> = ({ transaction, ...props }) => {
	const mutation = withTransactionDisputeMutation.useMutation();

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
						url: "/api/buyer/transaction/{transactionId}/dispute",
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
