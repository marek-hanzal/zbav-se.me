import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { withTransactionAcceptMutation } from "@zbav-se.me/sdk/mutation/seller/transaction";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";

export namespace AcceptButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionAcceptMutation.useMutation({
		onSuccess() {
			close();
		},
	});

	return (
		<Button
			data-ui="AcceptButton[Button]"
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate({
					path: {
						transactionId: transaction.id,
					},
					url: "/api/seller/transaction/{transactionId}/accept",
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
