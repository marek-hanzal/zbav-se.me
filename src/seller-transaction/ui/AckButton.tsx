import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { CheckIcon } from "~/application-ui/constant/icon.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { withTransactionAckMutation } from "~/seller-transaction/mutation/withTransactionAckMutation";
import type { TransactionSchema } from "~/seller-transaction/schema/TransactionSchema";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";

export namespace AckButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const AckButton: FC<AckButton.Props> = ({ close, transaction, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const mutation = withTransactionAckMutation.useMutation({
		async onPostMutation() {
			close();

			await navigate({
				to: "/$locale/app/seller/transaction/$listingId/list",
				params: {
					locale,
					listingId: transaction.listingId,
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
