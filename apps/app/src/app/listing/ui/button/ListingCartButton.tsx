import { usePatchCollection } from "@use-pico/client/hook";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tListing, tListingCollection, tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { CartIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { toast } from "sonner";

export namespace ListingCartButton {
	export interface Props extends ConfirmButton.Props {
		listing: tListing;
		query: tListingQuery | undefined;
		onSuccess?(toggle: boolean): void;
	}
}

export const ListingCartButton: FC<ListingCartButton.Props> = ({
	listing,
	query,
	onSuccess,
	buttonProps,
	confirmProps,
	onReset,
	disabled = false,
	...props
}) => {
	const setListingCollection = withListingCollectionQuery.useSet();

	const patch = usePatchCollection<tListingCollection>(listing);

	const listingCartToggleMutation = withListingCartToggleMutation.useMutation({
		async onPostMutation() {
			onSuccess?.(!listing.isInCart);
			setListingCollection(
				patch({
					id: listing.id,
					isInCart: !listing.isInCart,
				}),
				query,
			);
		},
		meta: {
			mutationId: listing.id,
		},
	});

	return (
		<ConfirmButton
			iconEnabled={CartIcon}
			tone={"primary"}
			theme={listing.isInCart ? "dark" : "light"}
			loading={listingCartToggleMutation.isPending}
			disabled={listing.hasFlag || listing.isIgnored || disabled}
			border={false}
			buttonProps={{
				size: "xl",
				...buttonProps,
				onClick(event) {
					if (listing.isInCart) {
						toast.warning(translator.text("Second tap to remove from cart (toast)"), {
							id: "listing-cart-button",
						});
					}

					if (!listing.isInCart) {
						toast.info(translator.text("Second tap to add to cart (toast)"), {
							id: "listing-cart-button",
						});
					}

					buttonProps?.onClick?.(event);
				},
			}}
			confirmProps={{
				tone: "secondary",
				theme: "dark",
				size: "xl",
				...confirmProps,
				onClick(e) {
					toast.promise(
						listingCartToggleMutation.mutateAsync({
							toggle: !listing.isInCart,
							listingId: listing.id,
						}),
						{
							loading: translator.text("Loading... (toast)"),
							success: translator.text(
								listing.isInCart
									? "Listing removed from your cart (toast)"
									: "Listing added to your cart (toast)",
							),
							error: translator.text("Error adding listing to cart (toast)"),
							id: "listing-cart-button",
						},
					);
					confirmProps?.onClick?.(e);
				},
			}}
			round={"full"}
			onReset={() => {
				toast.dismiss("listing-cart-button");
				onReset?.();
			}}
			{...props}
		/>
	);
};
