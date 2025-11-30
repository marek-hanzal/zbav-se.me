import type { tListingQuery, zListing } from "@zbav-se.me/sdk/api/user";
import { ToolbarContainer } from "@zbav-se.me/ui/toolbar";
import { type FC, useState } from "react";
import { ListingCartButton } from "../button/ListingCartButton";
import { ListingFlagButton } from "../button/ListingFlagButton";
import { ListingIgnoreButton } from "../button/ListingIgnoreButton";

export namespace ListingFeedToolbar {
	export type Tools = "cart" | "ignore" | "flag";

	export interface Props extends ToolbarContainer.Props {
		locale: string;
		query: tListingQuery | undefined;
		listing: zListing;
		tools?: Tools[];
	}
}

export const ListingFeedToolbar: FC<ListingFeedToolbar.Props> = ({
	locale,
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
	const [action, setIsAction] = useState<ListingFeedToolbar.Tools | undefined>(undefined);

	return (
		<ToolbarContainer {...props}>
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
