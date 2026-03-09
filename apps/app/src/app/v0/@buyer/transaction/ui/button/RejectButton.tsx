import { useQueryClient } from "@tanstack/react-query";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tTransaction } from "@zbav-se.me/sdk/api/buyer";
import { withTransactionStatusRejectMutation } from "@zbav-se.me/sdk/mutation/buyer/transaction";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import { withMessageQuery } from "@zbav-se.me/sdk/query/user/message";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace RejectButton {
	export interface Props extends Partial<ConfirmButton.Props> {
		transaction: tTransaction;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ transaction, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusRejectMutation.useMutation();

	return (
		<ConfirmButton
			data-ui="RejectButton[ConfirmButton]"
			iconEnabled={CancelIcon}
			confirmProps={{
				ui: {
					tone: "danger",
				},
				children: <Tx label="Reject transaction - confirm (button)" />,
				onClick() {
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
				},
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		>
			<Tx label="Reject transaction (button)" />
		</ConfirmButton>
	);
};
