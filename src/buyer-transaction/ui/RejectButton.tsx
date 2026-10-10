import type { FC } from "react";
import { CancelIcon } from "~/application-ui/constant/icon.exports";
import { withTransactionRejectMutation } from "~/buyer-transaction/mutation/withTransactionRejectMutation";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { Tx } from "~/translation/ui/Tx";
import { ConfirmButton } from "~/ui/ui/ConfirmButton";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace RejectButton {
	export interface Props extends Partial<ConfirmButton.Props> {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ closeFn, transaction, ...props }) => {
	const mutation = withTransactionRejectMutation.useMutation({
		async onPostMutationFn() {
			closeFn();
		},
	});

	return (
		<ConfirmButton
			data-ui="RejectButton[ConfirmButton]"
			data-action={"reject transaction"}
			iconEnabled={CancelIcon}
			confirmProps={{
				"data-ui-tone": "danger",
				children: <Tx label="Reject transaction - confirm (button)" />,
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
			<Tx label="Reject transaction (button)" />
		</ConfirmButton>
	);
};
