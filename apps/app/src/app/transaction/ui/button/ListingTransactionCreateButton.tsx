import { Button } from "@use-pico/client/ui/button";
import type { tListing, tTransaction } from "@zbav-se.me/sdk/api/user";
import { withTransactionCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { CashIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace TransactionCreateButton {
	export interface Props extends Button.Props {
		listing: tListing;
		onPostMutation?(transaction: tTransaction): Promise<void>;
	}
}

export const TransactionCreateButton: FC<TransactionCreateButton.Props> = ({
	listing,
	onPostMutation,
	ui,
	...props
}) => {
	const transactionCreate = withTransactionCreateMutation.useMutation({
		async onPostMutation({ result }) {
			return onPostMutation?.(result);
		},
	});

	return (
		<Button
			label={"Start transaction (button)"}
			iconEnabled={CashIcon}
			disabled={transactionCreate.isPending}
			loading={transactionCreate.isPending}
			onClick={() => {
				transactionCreate.mutate({
					listingId: listing.id,
				});
			}}
			ui={{
				tone: "secondary",
				theme: "light",
				size: "xl",
				justify: "start",
				...ui,
			}}
			{...props}
		/>
	);
};
