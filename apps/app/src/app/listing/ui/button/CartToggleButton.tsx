import { FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import type { FC } from "react";

export namespace CartToggleButton {
	export interface Props extends Button.Props {
		feedId: string;
		listing: tListing;
	}
}

export const CartToggleButton: FC<CartToggleButton.Props> = ({ feedId, listing, ...props }) => {
	const listingCartToggle = withListingCartToggleMutation.useMutation();

	return (
		<Button
			label={listing.isInCart ? "Remove from cart (button)" : "Add to cart (button)"}
			iconEnabled={listing.isInCart ? FavouriteIcon : FavouriteOffIcon}
			disabled={listingCartToggle.isPending}
			loading={listingCartToggle.isPending}
			tone={"primary"}
			theme={"light"}
			onClick={() =>
				listingCartToggle.mutate({
					feedId,
					listingId: listing.id,
					toggle: !listing.isInCart,
				})
			}
			size={"xl"}
			menu
			{...props}
		/>
	);
};
