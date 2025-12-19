import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { withTransactionStatusRejectMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
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
	const mutation = withTransactionStatusRejectMutation.useMutation({
		onSuccess() {
			withTransactionFetchQuery.invalidate(queryClient, {
				where: {
					id: transactionId,
				},
			});
		},
	});

	return (
		<Button
			data-ui="RejectButton[Button]"
			label={"Reject transaction (button)"}
			iconEnabled={CancelIcon}
			onClick={() => {
				mutation.mutate({
					transactionId,
				});
			}}
			loading={mutation.isPending}
			disabled={mutation.isPending}
			{...props}
		/>
	);
};
