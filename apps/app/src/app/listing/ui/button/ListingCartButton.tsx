import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation";
import { CartIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { toast } from "sonner";

export namespace ListingCartButton {
	export interface Props extends ConfirmButton.Props {
		listingId: string;
		isInCart: boolean;
		onSuccess(toggle: boolean): void;
	}
}

export const ListingCartButton: FC<ListingCartButton.Props> = ({
	listingId,
	isInCart,
	onSuccess,
	buttonProps,
	onReset,
	...props
}) => {
	const listingCartToggleMutation = withListingCartToggleMutation.useMutation(
		{
			onSuccess() {
				onSuccess(!isInCart);
				toast.success(
					translator.text(
						isInCart
							? "Listing removed from your cart (toast)"
							: "Listing added to your cart (toast)",
					),
				);
			},
			meta: {
				mutationId: listingId,
			},
		},
	);

	return (
		<ConfirmButton
			iconEnabled={CartIcon}
			tone={"primary"}
			theme={isInCart ? "dark" : "light"}
			loading={listingCartToggleMutation.isPending}
			buttonProps={{
				...buttonProps,
				onClick(event) {
					if (isInCart) {
						toast.warning(
							translator.text(
								"Second tap to remove from cart (toast)",
							),
							{
								id: "listing-cart-button",
							},
						);
					}

					if (!isInCart) {
						toast.info(
							translator.text(
								"Second tap to add to cart (toast)",
							),
							{
								id: "listing-cart-button",
							},
						);
					}

					buttonProps?.onClick?.(event);
				},
			}}
			confirmProps={{
				tone: "secondary",
				theme: "dark",
				onClick() {
					toast.dismiss("listing-cart-button");
					listingCartToggleMutation.mutate({
						toggle: !isInCart,
						listingId,
					});
				},
				size: "lg",
			}}
			onReset={() => {
				onReset?.();
				toast.dismiss("listing-cart-button");
			}}
			round={"full"}
			{...props}
		/>
	);
};
