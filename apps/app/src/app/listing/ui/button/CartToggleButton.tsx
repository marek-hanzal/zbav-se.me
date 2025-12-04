import { FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace CartToggleButton {
	export interface Props extends Button.Props {
		feedId: string;
		listingId: string;
	}
}

export const CartToggleButton: FC<CartToggleButton.Props> = ({ feedId, listingId, ...props }) => {
	const listingCartToggle = withListingCartToggleMutation.useMutation({
		meta: {
			mutationId: listingId,
		},
	});

	return (
		<withListingFetchQuery.Suspense
			data={{
				where: {
					id: listingId,
				},
			}}
			fallback={
				<Button
					label={"Loading... (button)"}
					disabled
					loading
					tone={"primary"}
					theme={"light"}
					size={"xl"}
					menu
					{...props}
				/>
			}
		>
			{({ data: listing }) => {
				return (
					<Button
						label={
							listing.isInCart ? "Remove from cart (button)" : "Add to cart (button)"
						}
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
			}}
		</withListingFetchQuery.Suspense>
	);
};
