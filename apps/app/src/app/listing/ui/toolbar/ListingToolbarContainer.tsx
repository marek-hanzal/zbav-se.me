import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { tListingQuery, zListing } from "@zbav-se.me/sdk/api/session";
import { type FC, useState } from "react";
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
					listing={listing}
					query={query}
					disabled={Boolean(action && action !== "cart")}
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
					listing={listing}
					query={query}
					disabled={Boolean(action && action !== "ignore")}
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
					listing={listing}
					query={query}
					disabled={Boolean(action && action !== "flag")}
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
