import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListing } from "@zbav-se.me/sdk/api/buyer";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { TransactionCreateButton } from "~/app/v0/@buyer/transaction/ui/TransactionCreateButton";

export namespace TransactionButton {
	export interface Props extends Button.Props {
		listing: tListing;
		onTransaction(): void;
	}
}

export const TransactionButton: FC<TransactionButton.Props> = ({
	listing,
	ui,
	onTransaction,
	...props
}) => {
	if (listing.transactionId) {
		return (
			<Button
				iconEnabled={TransactionIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				ui={{
					tone: "neutral",
					theme: "light",
					size: "default",
					...ui,
				}}
				onClick={onTransaction}
				{...props}
			>
				<Tx label="View transactions (button)" />
			</Button>
		);
	}

	return (
		<TransactionCreateButton
			listingId={listing.id}
			ui={ui}
			{...props}
		/>
	);
};
