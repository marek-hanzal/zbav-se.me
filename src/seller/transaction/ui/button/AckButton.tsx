import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { CheckIcon } from "~/common/ui/icon";
import type { TransactionSchema } from "~/seller/transaction/server/schema/TransactionSchema";
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
