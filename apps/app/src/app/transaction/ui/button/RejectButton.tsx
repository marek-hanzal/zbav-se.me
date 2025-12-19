import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { withTransactionStatusRejectMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useStatus } from "~/app/transaction/hook/useStatus";

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
				// biome-ignore lint/correctness/useHookAtTopLevel: Ssst
				const { status } = useStatus({
					transaction,
				});

				if (status !== "accepted") {
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
