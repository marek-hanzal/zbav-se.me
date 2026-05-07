import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { CheckIcon } from "~/common/ui/icon";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionSuccessMutation } from "../../mutation/withTransactionSuccessMutation";

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
