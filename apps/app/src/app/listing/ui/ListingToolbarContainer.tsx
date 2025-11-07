import { Container } from "@use-pico/client/ui/container";
import type { zListing } from "@zbav-se.me/sdk/api/session";
import { type FC, useState } from "react";
import { ListingCartButton } from "./button/ListingCartButton";
import { ListingFlagButton } from "./button/ListingFlagButton";
import { ListingIgnoreButton } from "./button/ListingIgnoreButton";

export namespace ListingToolbarContainer {
	export interface Props extends Container.Props {
		listing: zListing;
		onCartToggle(toggle: boolean): void;
		onIgnoreToggle(toggle: boolean): void;
		onFlagToggle(toggle: boolean): void;
	}
}

export const ListingToolbarContainer: FC<ListingToolbarContainer.Props> = ({
	listing,
	onCartToggle,
	onIgnoreToggle,
	onFlagToggle,
	...props
}) => {
	const [action, setIsAction] = useState<
		"cart" | "ignore" | "flag" | undefined
	>(undefined);

	return (
		<Container
			layout={"vertical-flex"}
			items={"center"}
			height={"unset"}
			width={"unset"}
			snapTo={"right-center"}
			square={"md"}
			border={"default"}
			shadow={"default"}
			round={"full"}
			gap={"md"}
			tone={"secondary"}
			theme={"light"}
			tweak={{
				slot: {
					root: {
						class: [
							"opacity-75",
							"z-100",
						],
					},
				},
			}}
			{...props}
		>
			<ListingCartButton
				listingId={listing.id}
				isInCart={listing.isInCart}
				onSuccess={onCartToggle}
				disabled={listing.isIgnored || (action && action !== "cart")}
				buttonProps={{
					onClick() {
						setIsAction("cart");
					},
				}}
				onReset={() => setIsAction(undefined)}
			/>

			<ListingIgnoreButton
				listingId={listing.id}
				isIgnored={listing.isIgnored}
				disabled={listing.isInCart || (action && action !== "ignore")}
				onSuccess={onIgnoreToggle}
				buttonProps={{
					onClick() {
						setIsAction("ignore");
					},
				}}
				onReset={() => setIsAction(undefined)}
			/>

			<ListingFlagButton
				listingId={listing.id}
				hasFlag={listing.hasFlag}
				disabled={listing.isInCart || (action && action !== "flag")}
				onSuccess={onFlagToggle}
				buttonProps={{
					onClick() {
						setIsAction("flag");
					},
				}}
				onReset={() => setIsAction(undefined)}
			/>
		</Container>
	);
};
