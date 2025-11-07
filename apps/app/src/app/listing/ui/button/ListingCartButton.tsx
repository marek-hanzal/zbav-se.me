import { Badge } from "@use-pico/client/ui/badge";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { useToast } from "@use-pico/client/ui/toast";
import { Tx } from "@use-pico/client/ui/tx";
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
	buttonProps,
	...props
}) => {
	const toast = useToast();

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
			buttonProps={{
				...buttonProps,
				onClick(event) {
					toast({
						id: "listing-cart-button",
						render() {
							return (
								<Badge>
									<Tx label="Druhým kliknutím potvrď přidání do košíku" />
								</Badge>
							);
						},
					});
					buttonProps?.onClick?.(event);
				},
			}}
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
