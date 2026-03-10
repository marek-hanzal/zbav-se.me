import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionCloseMutation } from "@zbav-se.me/sdk/mutation/buyer/transaction";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import type { FC } from "react";

export namespace CloseButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const CloseButton: FC<CloseButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionCloseMutation.useMutation({
		async onPostMutation() {
			withTransactionQuery.invalidator(
				queryClient,
				[
					"fetch",
				],
				{
					fetch: {
						where: {
							id: transaction.id,
						},
					},
				},
			);
			withTransactionEntryQuery.invalidator(queryClient, [
				"collection",
				"count",
			]);
		},
	});

	return (
		<Button
			data-ui="CloseButton[Button]"
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate({
					path: {
						transactionId: transaction.id,
					},
					url: "/api/buyer/transaction/{transactionId}/close",
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
