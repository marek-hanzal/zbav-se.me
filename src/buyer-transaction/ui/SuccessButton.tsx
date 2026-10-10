import type { FC } from "react";
import { CheckIcon } from "~/application-ui/constant/icon.exports";
import { withTransactionSuccessMutation } from "~/buyer-transaction/mutation/withTransactionSuccessMutation";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace SuccessButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const SuccessButton: FC<SuccessButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionSuccessMutation.useMutation({
		async onPostMutation() {
			close();
		},
	});

	return (
		<Button
			data-ui="SuccessButton[Button]"
			data-action={"mark transaction successful"}
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
			<Tx label="Mark transaction as successful (button)" />
		</Button>
	);
};
