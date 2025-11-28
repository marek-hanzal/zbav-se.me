import { ListingDetailButton } from "@zbav-se.me/buyer/listing";
import type { tListingQuery, zListing } from "@zbav-se.me/sdk/api/user";
import { ToolbarContainer } from "@zbav-se.me/ui/toolbar";
import { type FC, useId, useState } from "react";
import { ListingDetailMenu } from "~/app/listing/ui/ListingDetailMenu";
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
	const detailSheetId = useId();

	return (
		<ToolbarContainer {...props}>
			<ListingDetailButton
				locale={locale}
				detailSheetId={detailSheetId}
				listing={listing}
				round={"full"}
				menu={false}
			>
				<ListingDetailMenu
					locale={locale}
					listing={listing}
					tools={[
						"cart",
						"transaction",
					]}
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
		</ToolbarContainer>
	);
};
