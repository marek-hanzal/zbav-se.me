import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { withTransactionResolveMutation } from "@zbav-se.me/sdk/mutation/seller/transaction";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { withTransactionEntryQuery } from "@zbav-se.me/sdk/query/user/transaction-entry";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace ResolveButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const ResolveButton: FC<ResolveButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionResolveMutation.useMutation();

	return (
		<Button
			data-ui="ResolveButton[Button]"
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate(
					{
						path: {
							transactionId: transaction.id,
						},
						url: "/api/seller/transaction/{transactionId}/resolve",
					},
					{
						onSuccess() {
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
					},
				);
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		>
			<Tx label="Resolve transaction (button)" />
		</Button>
	);
};
