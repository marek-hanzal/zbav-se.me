import type { FC } from "react";
import { CheckIcon } from "~/application-ui/constant/icon.exports";
import { withTransactionResolveMutation } from "~/seller-transaction/mutation/withTransactionResolveMutation";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace ResolveButton {
	export interface Props extends Button.Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const ResolveButton: FC<ResolveButton.Props> = ({ closeFn, transaction, ...props }) => {
	const mutation = withTransactionResolveMutation.useMutation({
		async onPostMutationFn() {
			closeFn();
		},
	});

	return (
		<Button
			data-ui="ResolveButton[Button]"
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
			<Tx label="Resolve transaction (button)" />
		</Button>
	);
};
