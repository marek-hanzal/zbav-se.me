import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { withTransactionStatusAcceptMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withMessageThreadMessageCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useSide } from "~/app/user/useSide";

export namespace AcceptButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ transactionId, ...props }) => {
	const side = useSide();
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusAcceptMutation.useMutation();

	if (side === "buyer") {
		return null;
	}

	return (
		<withTransactionFetchQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			fallback={
				<Button
					data-ui="AcceptButton[Button]"
					label={"Accept transaction (button)"}
					iconEnabled={CheckIcon}
					loading
					disabled
					{...props}
				/>
			}
		>
			{({ data: transaction }) => {
				if (transaction.status !== "request") {
					return null;
				}

				return (
					<Button
						data-ui="AcceptButton[Button]"
						label={"Accept transaction (button)"}
						iconEnabled={CheckIcon}
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
