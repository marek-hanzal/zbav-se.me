import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/seller";
import { withTransactionStatusResolveMutation } from "@zbav-se.me/sdk/mutation/seller/transaction-status";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import { withMessageQuery } from "@zbav-se.me/sdk/query/user/message";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace ResolveButton {
	export interface Props extends Button.Props {
		transaction: tTransaction;
	}
}

export const ResolveButton: FC<ResolveButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusResolveMutation.useMutation();

	return (
		<Button
			data-ui="ResolveButton[Button]"
			iconEnabled={CheckIcon}
			onClick={() => {
				mutation.mutate(
					{
						transactionId: transaction.id,
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
							withMessageQuery.invalidator(queryClient, [
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
