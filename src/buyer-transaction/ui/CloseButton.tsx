import type { FC } from "react";
import { withTransactionCloseMutation } from "~/buyer-transaction/mutation/withTransactionCloseMutation";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { Tx } from "~/translation/ui/Tx";
import { CheckIcon } from "~/ui/constant/CheckIcon";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace CloseButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const CloseButton: FC<CloseButton.Props> = ({ close, transaction, ...props }) => {
	const mutation = withTransactionCloseMutation.useMutation({
		async onPostMutation() {
			close();
		},
	});

	return (
		<Button
			data-ui="CloseButton[Button]"
			data-action={"close transaction"}
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
			<Tx label="Close transaction (button)" />
		</Button>
	);
};
