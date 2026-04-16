import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { CheckIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { TransactionSchema } from "~/buyer/transaction/server/schema/TransactionSchema";
import type { TransactionMenuButton } from "~/user/transaction/ui/TransactionMenuButton";
import { archiveSellerMessageActivity } from "../../service/archiveSellerMessageActivity";

export namespace AckButton {
	export interface Props extends Button.Props {
		close: TransactionMenuButton.Close;
		transaction: TransactionSchema.Type;
	}
}

export const AckButton: FC<AckButton.Props> = ({ close, transaction, ...props }) => {
	const locale = useLocale();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const mutation = useMutation({
		async mutationFn(transactionId: string) {
			return archiveSellerMessageActivity({
				queryClient,
				transactionId,
			});
		},
		onSuccess() {
			navigate({
				to: "/$locale/app/buyer/transaction/list",
				params: {
					locale,
				},
			});
		},
	});

	return (
		<Button
			data-ui="AckButton"
			data-action={"acknowledge transaction"}
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate(transaction.id);
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		>
			<Tx label="Acknowledge transaction (button)" />
		</Button>
	);
};
