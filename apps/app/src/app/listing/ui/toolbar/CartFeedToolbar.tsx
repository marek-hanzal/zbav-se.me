import { ShowIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import type { tListingQuery, zListing } from "@zbav-se.me/sdk/api/user";
import { ToolbarContainer } from "@zbav-se.me/ui/toolbar";
import { type FC, useState } from "react";
import { ListingCartButton } from "../button/ListingCartButton";

export namespace CartFeedToolbar {
	export type Tools = "cart";

	export interface Props extends ToolbarContainer.Props {
		locale: string;
		query: tListingQuery | undefined;
		listing: zListing;
		tools?: Tools[];
	}
}

export const CartFeedToolbar: FC<CartFeedToolbar.Props> = ({
	locale,
	query,
	listing,
	tools = [
		"cart",
	],
	tweak,
	...props
}) => {
	const [action, setIsAction] = useState<CartFeedToolbar.Tools | undefined>(undefined);

	return (
		<ToolbarContainer {...props}>
			<Button
				iconEnabled={ShowIcon}
				tone={"primary"}
				theme={"light"}
				size={"xl"}
				round={"full"}
			/>

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
