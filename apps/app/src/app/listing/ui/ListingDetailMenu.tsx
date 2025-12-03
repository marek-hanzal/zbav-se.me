import { ArrowRightIcon, FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { VariantProvider } from "@use-pico/cls";
import { TransactionButton } from "@zbav-se.me/common/listing";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingCartCountQuery } from "@zbav-se.me/sdk/query/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

export namespace ListingDetailMenu {
	export type Tools = "transaction" | "cart" | "go-to-cart";

	export interface Props extends Container.Props {
		locale: string;
		listing: tListing;
		tools?: Tools[];
		parentSheetId: string | undefined;
	}
}

export const ListingDetailMenu: FC<ListingDetailMenu.Props> = ({
	locale,
	listing,
	tools = [
		"transaction",
		"cart",
		"go-to-cart",
	],
	parentSheetId,
	...props
}) => {
	const listingCartToggle = withListingCartToggleMutation.useMutation();

	return (
		<Container
			layout={"vertical-flex"}
			height={"content"}
			gap={"lg"}
			{...props}
		>
			<VariantProvider
				cls={ThemeCls}
				variant={{
					tone: "secondary",
					theme: "light",
				}}
			>
				{tools.includes("transaction") ? (
					<TransactionButton
						locale={locale}
						listing={listing}
						parentSheetId={parentSheetId}
					/>
				) : null}

				{tools.includes("cart") ? (
					<Button
						label={
							listing.isInCart ? "Remove from cart (button)" : "Add to cart (button)"
						}
						iconEnabled={listing.isInCart ? FavouriteIcon : FavouriteOffIcon}
						disabled={listingCartToggle.isPending}
						loading={listingCartToggle.isPending}
						theme={"light"}
						onClick={() =>
							listingCartToggle.mutate({
								listingId: listing.id,
								toggle: !listing.isInCart,
							})
						}
						size={"xl"}
						menu
					/>
				) : null}

				{tools.includes("go-to-cart") ? (
					<withListingCartCountQuery.Suspense
						data={{}}
						fallback={
							<Button
								disabled
								loading
								label={"Loading cart count (button)"}
								size={"xl"}
								menu
							/>
						}
					>
						{({ data }) => {
							return (
								<LinkTo
									to={"/$locale/buyer/cart/list"}
									params={{
										locale,
									}}
									disabled={data.filter === 0}
									full
								>
									<Button
										iconEnabled={data.filter > 0 ? ArrowRightIcon : undefined}
										disabled={data.filter === 0}
										label={
											data.filter > 0
												? "Go to cart (button)"
												: "Nothing in cart yet (button)"
										}
										size={"xl"}
										menu
									/>
								</LinkTo>
							);
						}}
					</withListingCartCountQuery.Suspense>
				) : null}
			</VariantProvider>
		</Container>
	);
};
