import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { zListing } from "@zbav-se.me/sdk/api/session";
import { type FC, useState } from "react";
import { ListingCartButton } from "../../feed/ui/button/ListingCartButton";
import { ListingFlagButton } from "../../feed/ui/button/ListingFlagButton";
import { ListingIgnoreButton } from "../../feed/ui/button/ListingIgnoreButton";

export namespace ListingToolbarContainer {
	export interface Props extends Container.Props {
		feedId: string;
		listing: zListing;
		onCartToggle?(toggle: boolean): void;
		onIgnoreToggle(toggle: boolean): void;
		onFlagToggle(toggle: boolean): void;
	}
}

export const ListingToolbarContainer: FC<ListingToolbarContainer.Props> = ({
	feedId,
	listing,
	onCartToggle,
	onIgnoreToggle,
	onFlagToggle,
	tweak,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});

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
			gap={"lg"}
			tone={"secondary"}
			theme={"light"}
			tweak={[
				tweak,
				{
					slot: {
						root: {
							class: [
								"opacity-80",
								"z-100",
							],
						},
					},
				},
			]}
			{...props}
		>
			<LinkTo
				to={"/$locale/buyer/feed/$id/listing/$listingId/view"}
				params={{
					locale,
					id: feedId,
					listingId: listing.id,
				}}
			>
				<Button
					iconEnabled={ArrowRightIcon}
					tone={"primary"}
					theme={"light"}
					size={"xl"}
					round={"full"}
				/>
			</LinkTo>

			{onCartToggle ? (
				<ListingCartButton
					listingId={listing.id}
					isInCart={listing.isInCart}
					onSuccess={onCartToggle}
					disabled={
						listing.hasFlag ||
						listing.isIgnored ||
						(action && action !== "cart")
					}
					buttonProps={{
						onClick() {
							setIsAction("cart");
						},
					}}
					confirmProps={{
						onClick() {
							setIsAction(undefined);
						},
					}}
					onReset={() => {
						setIsAction(undefined);
					}}
				/>
			) : null}

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
				confirmProps={{
					onClick() {
						setIsAction(undefined);
					},
				}}
				onReset={() => {
					setIsAction(undefined);
				}}
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
				confirmProps={{
					onClick() {
						setIsAction(undefined);
					},
				}}
				onReset={() => {
					setIsAction(undefined);
				}}
			/>
		</Container>
	);
};
