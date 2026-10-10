import type { FC } from "react";
import { FlagIcon } from "~/application-ui/constant/icon.exports";
import { withTransactionDisputeMutation } from "~/buyer-transaction/mutation/withTransactionDisputeMutation";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { Tx } from "~/translation/ui/Tx";
import { ConfirmButton } from "~/ui/ui/ConfirmButton";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace DisputeButton {
	export interface Props extends ConfirmButton.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const DisputeButton: FC<DisputeButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionDisputeMutation.useMutation({
		async onPostMutation() {
			close();
		},
	});

	return (
		<ConfirmButton
			data-ui="DisputeButton[Button]"
			data-action={"dispute transaction"}
			iconEnabled={FlagIcon}
			confirmProps={{
				"data-ui-tone": "danger",
				children: <Tx label="Dispute transaction - confirm (button)" />,
				onClick() {
					mutation.mutate({
						id: transaction.id,
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
