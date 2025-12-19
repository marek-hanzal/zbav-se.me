import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { withTransactionStatusAcceptMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withTransactionFetchQuery } from "@zbav-se.me/sdk/query/user/transaction";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace AcceptButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

export const AcceptButton: FC<AcceptButton.Props> = ({ transactionId, ...props }) => {
	const queryClient = useQueryClient();
	const mutation = withTransactionStatusAcceptMutation.useMutation({
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
			data-ui="AcceptButton[Button]"
			label={"Accept transaction (button)"}
			iconEnabled={CheckIcon}
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
