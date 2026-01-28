import { Button } from "@use-pico/client/ui/button";
import type { tListing } from "@zbav-se.me/sdk/api/seller-user";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { CreateButton } from "~/app/transaction/ui/CreateButton";

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
				label={"View transactions (button)"}
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
			/>
		);
	}

	return (
		<CreateButton
			listingId={listing.id}
			ui={ui}
			{...props}
		/>
	);
};
