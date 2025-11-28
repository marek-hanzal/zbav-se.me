import { ShowIcon } from "@use-pico/client/icon";
import { ListingDetailButton } from "@zbav-se.me/buyer/listing";
import type { tListingQuery, zListing } from "@zbav-se.me/sdk/api/user";
import { ToolbarContainer } from "@zbav-se.me/ui/toolbar";
import { type FC, useId, useState } from "react";
import { ListingDetailMenu } from "~/app/listing/ui/ListingDetailMenu";
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
	const detailSheetId = useId();

	return (
		<ToolbarContainer {...props}>
			<ListingDetailButton
				locale={locale}
				detailSheetId={detailSheetId}
				listing={listing}
				iconEnabled={ShowIcon}
				round={"full"}
				menu={false}
			>
				<ListingDetailMenu
					locale={locale}
					listing={listing}
				/>
			</ListingDetailButton>

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
