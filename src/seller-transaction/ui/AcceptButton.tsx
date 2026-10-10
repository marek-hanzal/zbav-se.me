import type { FC } from "react";
import { CheckIcon } from "~/application-ui/constant/icon.exports";
import { withTransactionAcceptMutation } from "~/seller-transaction/mutation/withTransactionAcceptMutation";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

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
