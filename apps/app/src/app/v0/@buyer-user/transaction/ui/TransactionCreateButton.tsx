import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withTransactionCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-user/transaction";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace TransactionCreateButton {
	export interface Props extends Button.Props {
		listingId: string;
	}
}

export const TransactionCreateButton: FC<TransactionCreateButton.Props> = ({
	listingId,
	ui,
	...props
}) => {
	const queryClient = useQueryClient();
	const transactionCreateMutation = withTransactionCreateMutation.useMutation({
		onSuccess() {
			withListingFetchQuery.invalidate(queryClient, {
				where: {
					id: listingId,
				},
			});
		},
	});

	return (
		<Button
			iconEnabled={TransactionIcon}
			iconProps={{
				ui: {
					text: "xl",
				},
			}}
			disabled={transactionCreateMutation.isPending}
			loading={transactionCreateMutation.isPending}
			onClick={() => {
				transactionCreateMutation.mutate({
					listingId,
				});
			}}
			ui={{
				tone: "secondary",
				theme: "light",
				size: "default",
				text: "lg",
				...ui,
			}}
			{...props}
		>
			<Tx label="Create transaction (button)" />
		</Button>
	);
};
