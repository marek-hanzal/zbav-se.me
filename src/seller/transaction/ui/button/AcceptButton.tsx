import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { CheckIcon } from "~/common/ui/icon";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionAcceptMutation } from "../../mutation/withTransactionAcceptMutation";

export namespace AcceptButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionAcceptMutation.useMutation({
		async onPostMutation() {
			close();
		},
	});

	return (
		<Button
			data-ui="AcceptButton[Button]"
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
			<Tx label="Accept transaction (button)" />
		</Button>
	);
};
