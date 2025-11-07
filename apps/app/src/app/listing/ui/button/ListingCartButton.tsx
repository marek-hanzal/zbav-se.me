import { ConfirmButton } from "@use-pico/client/ui/button";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation";
import { CartIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

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
	...props
}) => {
	const listingCartToggleMutation = withListingCartToggleMutation.useMutation(
		{
			onSuccess() {
				onSuccess(!isInCart);
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
			confirmProps={{
				tone: "secondary",
				theme: "dark",
				onClick() {
					listingCartToggleMutation.mutate({
						toggle: !isInCart,
						listingId,
					});
				},
				size: "lg",
			}}
			round={"full"}
			{...props}
		/>
	);
};
