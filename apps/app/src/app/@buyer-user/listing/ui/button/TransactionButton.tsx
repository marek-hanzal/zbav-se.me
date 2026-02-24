import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tListing } from "@zbav-se.me/sdk/api/buyer-user";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { TransactionCreateButton } from "~/app/@buyer-user/transaction/ui/TransactionCreateButton";

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
				label={translator.text("View transactions (button)")}
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
		<TransactionCreateButton
			listingId={listing.id}
			ui={ui}
			{...props}
		/>
	);
};
