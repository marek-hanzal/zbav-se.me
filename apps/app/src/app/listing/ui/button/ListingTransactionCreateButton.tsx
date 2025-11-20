import { Button } from "@use-pico/client/ui/button";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace ListingTransactionCreateButton {
	export interface Props extends Button.Props {
		listing: tListing;
		onPostMutation?(): Promise<void>;
	}
}

export const ListingTransactionCreateButton: FC<ListingTransactionCreateButton.Props> = ({
	listing,
	onPostMutation,
	...props
}) => {
	const listingTransactionCreate = withListingTransactionCreateMutation.useMutation({
		onPostMutation,
	});

	return (
		<Button
			label={"Start transaction (button)"}
			iconEnabled={TransactionIcon}
			disabled={listingTransactionCreate.isPending}
			loading={listingTransactionCreate.isPending}
			tone={"secondary"}
			theme={"light"}
			onClick={() => {
				listingTransactionCreate.mutate({
					listingId: listing.id,
				});
			}}
			size={"xl"}
			full
			{...props}
		/>
	);
};
