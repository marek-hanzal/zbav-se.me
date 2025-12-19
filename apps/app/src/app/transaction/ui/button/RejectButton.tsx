import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { withTransactionStatusRejectMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace RejectButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

export const RejectButton: FC<RejectButton.Props> = ({ transactionId, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusRejectMutation.useMutation();

	return (
		<withTransactionFetchQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			options={{
				refetchInterval: 1_000 * 5,
			}}
			fallback={
				<Button
					data-ui="RejectButton[Button]"
					label={"Reject transaction (button)"}
					iconEnabled={CancelIcon}
					loading
					disabled
					{...props}
				/>
			}
		>
			{({ data: transaction }) => {
				if (transaction.status !== "accepted" && transaction.status !== "request") {
					return null;
				}

				return (
					<Button
						data-ui="RejectButton[Button]"
						label={"Reject transaction (button)"}
						iconEnabled={CancelIcon}
						onClick={() => {
							mutation.mutate(
								{
									transactionId: transaction.id,
								},
								{
									onSuccess() {
										withTransactionFetchQuery.invalidate(queryClient, {
											where: {
												id: transaction.id,
											},
										});
										withMessageThreadMessageCollectionQuery.invalidate(
											queryClient,
											{
												path: {
													messageThreadId: transaction.messageThreadId,
												},
											},
										);
									},
								},
							);
						}}
						loading={mutation.isPending}
						disabled={mutation.isPending}
						{...props}
					/>
				);
			}}
		</withTransactionFetchQuery.Suspense>
	);
};
