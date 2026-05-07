import type { FC } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { CancelIcon } from "~/common/ui/icon";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionRejectMutation } from "../../mutation/withTransactionRejectMutation";

export namespace RejectButton {
	export interface Props extends Partial<ConfirmButton.Props> {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionRejectMutation.useMutation({
		async onPostMutation() {
			close();
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
