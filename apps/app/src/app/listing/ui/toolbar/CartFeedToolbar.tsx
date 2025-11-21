import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { tListingQuery, zListing } from "@zbav-se.me/sdk/api/user";
import { ToolbarContainer } from "@zbav-se.me/ui/toolbar";
import { type FC, useState } from "react";
import { ListingCartButton } from "../button/ListingCartButton";

export namespace CartFeedToolbar {
	export type Tools = "cart";

	export interface Props extends ToolbarContainer.Props {
		query: tListingQuery | undefined;
		listing: zListing;
		tools?: Tools[];
	}
}

export const CartFeedToolbar: FC<CartFeedToolbar.Props> = ({
	query,
	listing,
	tools = [
		"cart",
	],
	tweak,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	const [action, setIsAction] = useState<CartFeedToolbar.Tools | undefined>(undefined);

	return (
		<ToolbarContainer {...props}>
			<LinkTo
				to={"/$locale/buyer/cart/listing/$id/view"}
				params={{
					locale,
					id: listing.id,
				}}
				search={{
					categoryId: listing.categoryId,
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
		</ToolbarContainer>
	);
};
