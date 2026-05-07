import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { CheckIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionCloseMutation } from "../../mutation/withTransactionCloseMutation";

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
