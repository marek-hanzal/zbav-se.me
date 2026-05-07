import type { FC } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { FlagIcon } from "~/common/ui/icon";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionDisputeMutation } from "../../mutation/withTransactionDisputeMutation";

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
