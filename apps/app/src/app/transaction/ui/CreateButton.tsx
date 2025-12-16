import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@use-pico/client/ui/button";
import { withTransactionCreateMutation } from "@zbav-se.me/sdk/mutation/user/transaction";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace CreateButton {
	export interface Props extends Button.Props {
		listingId: string;
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ listingId, ui, ...props }) => {
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
			label={"Create transaction (button)"}
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
		/>
	);
};
