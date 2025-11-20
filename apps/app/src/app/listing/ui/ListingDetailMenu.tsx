import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { VariantProvider } from "@use-pico/cls";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingCartCountQuery } from "@zbav-se.me/sdk/query/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { CartIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { ListingTransactionCreateButton } from "~/app/listing/ui/button/ListingTransactionCreateButton";

export namespace ListingDetailMenu {
	export interface Props extends Container.Props {
		listing: tListing;
	}
}

export const ListingDetailMenu: FC<ListingDetailMenu.Props> = ({ listing, ...props }) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const navigate = useNavigate();

	const listingCartCount = withListingCartCountQuery.useSuspenseQuery({});

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
				{/** biome-ignore lint/correctness/noConstantCondition: <explanation> */}
				{true ? (
					<ListingTransactionCreateButton
						listing={listing}
						onPostMutation={() => {
							return navigate({
								to: "/$locale/buyer/transaction/list",
								params: {
									locale,
								},
							});
						}}
					/>
				) : null}

				<Button
					label={listing.isInCart ? "Remove from cart (button)" : "Add to cart (button)"}
					iconEnabled={CartIcon}
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
					full
				/>

				<LinkTo
					to={"/$locale/buyer/cart/list"}
					params={{
						locale,
					}}
					disabled={listingCartCount.data.filter === 0}
					full
				>
					<Button
						iconEnabled={listingCartCount.data.filter > 0 ? ArrowRightIcon : undefined}
						iconPosition={"right"}
						disabled={listingCartCount.data.filter === 0}
						label={
							listingCartCount.data.filter > 0
								? "Go to cart (button)"
								: "Nothing in cart yet (button)"
						}
						size={"xl"}
						full
					/>
				</LinkTo>
			</VariantProvider>
		</Container>
	);
};
