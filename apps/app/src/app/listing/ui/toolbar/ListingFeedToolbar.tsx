import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { tListingQuery, zListing } from "@zbav-se.me/sdk/api/user";
import { ToolbarContainer } from "@zbav-se.me/ui/toolbar";
import { type FC, useState } from "react";
import { ListingCartButton } from "../button/ListingCartButton";
import { ListingFlagButton } from "../button/ListingFlagButton";
import { ListingIgnoreButton } from "../button/ListingIgnoreButton";

export namespace ListingFeedToolbar {
	export type Tools = "cart" | "ignore" | "flag";

	export interface Props extends ToolbarContainer.Props {
		query: tListingQuery | undefined;
		listing: zListing;
		tools?: Tools[];
	}
}

export const ListingFeedToolbar: FC<ListingFeedToolbar.Props> = ({
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

	const [action, setIsAction] = useState<ListingFeedToolbar.Tools | undefined>(undefined);

	return (
		<ToolbarContainer {...props}>
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
		</ToolbarContainer>
	);
};
