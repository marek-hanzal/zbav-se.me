import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { CheckIcon } from "~/application-ui/constant/icon.exports";
import { withTransactionAckMutation } from "~/buyer-transaction/mutation/withTransactionAckMutation";
import type { TransactionSchema } from "~/buyer-transaction/schema/TransactionSchema";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace AckButton {
	export interface Props extends Button.Props {
		closeFn: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const AckButton: FC<AckButton.Props> = ({ closeFn, transaction, ...props }) => {
	const locale = useLocale();
	const navigateFn = useNavigate();
	const mutation = withTransactionAckMutation.useMutation({
		async onPostMutationFn() {
			closeFn();

			await navigateFn({
				to: "/$locale/app/buyer/transaction/list",
				params: {
					locale,
				},
			});
		},
	});

	return (
		<Button
			data-ui="AckButton[Button]"
			data-action={"acknowledge transaction"}
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate({
					listingId: transaction.listingId,
					transactionId: transaction.id,
				});
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		>
			<Tx label="Acknowledge transaction (button)" />
		</Button>
	);
};
