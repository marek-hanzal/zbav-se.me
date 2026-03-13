import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { withTransactionResolveMutation } from "@zbav-se.me/sdk/mutation/seller/transaction";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import type { TransactionMenuButton } from "~/app/@common/transaction/ui/TransactionMenuButton";

export namespace ResolveButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: tTransaction;
	}
}

export const ResolveButton: FC<ResolveButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionResolveMutation.useMutation({
		onSuccess() {
			close();
		},
	});

	return (
		<Button
			data-ui="ResolveButton[Button]"
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate({
					path: {
						transactionId: transaction.id,
					},
					url: "/api/seller/transaction/{transactionId}/resolve",
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
