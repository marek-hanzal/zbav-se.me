import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import { CheckIcon } from "~/common/ui/icon";
import { useLocale } from "~/locale/hook/useLocale";
import { Tx } from "~/translation/ui/Tx";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { withTransactionAckMutation } from "../../mutation/withTransactionAckMutation";

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
