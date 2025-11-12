import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { EntitySchema } from "@use-pico/common/schema";
import type {
	tListing,
	tListingCollection,
	tListingQuery,
	zListing,
} from "@zbav-se.me/sdk/api/session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { type FC, useCallback, useState } from "react";
import { ListingCartButton } from "./button/ListingCartButton";
import { ListingFlagButton } from "./button/ListingFlagButton";
import { ListingIgnoreButton } from "./button/ListingIgnoreButton";

export namespace ListingToolbarContainer {
	export type Tools = "cart" | "ignore" | "flag";

	export interface Props extends Container.Props {
		query: tListingQuery | undefined;
		listing: zListing;
		tools?: Tools[];
	}
}

export const ListingToolbarContainer: FC<ListingToolbarContainer.Props> = ({
	query,
	listing,
	tools = [
		"cart",
		"ignore",
		"flag",
	],
	tweak,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	const [action, setIsAction] = useState<
		"cart" | "ignore" | "flag" | undefined
	>(undefined);

	const setListingCollection = withListingCollectionQuery.useSet();

	const patch = useCallback(
		(patch: Partial<tListing> & EntitySchema.Type) =>
			(
				prev: tListingCollection | undefined,
			): tListingCollection | undefined => {
				if (!prev) {
					return prev;
				}

				return {
					...prev,
					data: prev.data.map((item) => {
						if (item.id === listing.id) {
							return {
								...item,
								...patch,
							};
						}
						return item;
					}),
				};
			},
		[
			listing.id,
		],
	);

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
				to={"/$locale/buyer/listing/$id/view"}
				params={{
					locale,
					id: listing.id,
				}}
				search={query}
			>
				<Button
					iconEnabled={ArrowRightIcon}
					tone={"primary"}
					theme={"light"}
					size={"xl"}
					round={"full"}
				/>
			</LinkTo>

			{tools.includes("cart") ? (
				<ListingCartButton
					listingId={listing.id}
					isInCart={listing.isInCart}
					onSuccess={(isIgnored) => {
						setListingCollection(
							patch({
								id: listing.id,
								isIgnored,
							}),
							query,
						);
					}}
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

			{tools.includes("ignore") ? (
				<ListingIgnoreButton
					listingId={listing.id}
					isIgnored={listing.isIgnored}
					disabled={
						listing.isInCart || (action && action !== "ignore")
					}
					onSuccess={(isIgnored) => {
						setListingCollection(
							patch({
								id: listing.id,
								isIgnored,
							}),
							query,
						);
					}}
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
			) : null}

			{tools.includes("flag") ? (
				<ListingFlagButton
					listingId={listing.id}
					hasFlag={listing.hasFlag}
					disabled={listing.isInCart || (action && action !== "flag")}
					onSuccess={(hasFlag) => {
						setListingCollection(
							patch({
								id: listing.id,
								hasFlag,
							}),
							query,
						);
					}}
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
			) : null}
		</Container>
	);
};
