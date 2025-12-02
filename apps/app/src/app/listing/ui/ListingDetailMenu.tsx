import { ArrowRightIcon, FavouriteIcon, FavouriteOffIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { VariantProvider } from "@use-pico/cls";
import { TransactionLogList } from "@zbav-se.me/common/listing-transaction-log";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withListingCartToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import {
	withListingCartCountQuery,
	withListingTransactionFetchQuery,
} from "@zbav-se.me/sdk/query/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import { type FC, Suspense, useState } from "react";
import { ListingTransactionCreateButton } from "~/app/listing/ui/button/ListingTransactionCreateButton";

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
	const [isTransaction, setIsTransaction] = useState(false);

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
				{tools.includes("transaction") && listing.transactionId ? (
					<>
						<Button
							tone={"primary"}
							label={"View transactions (button)"}
							iconEnabled={TransactionIcon}
							iconPosition={"right"}
							theme={"light"}
							size={"xl"}
							menu
							onClick={() => setIsTransaction((prev) => !prev)}
						/>

						<BottomSheet
							isOpen={isTransaction}
							onClose={() => setIsTransaction(false)}
							detent={"default"}
							contentProps={{
								disableScroll: true,
							}}
							modalEffectRootId={parentSheetId}
							header={{
								close: true,
								title: "Listing transactions (title)",
							}}
						>
							<Suspense fallback={<SpinnerContainer />}>
								<withListingTransactionFetchQuery.Suspense
									data={{
										where: {
											id: listing.transactionId,
										},
									}}
									fallback={<SpinnerContainer />}
								>
									{({ data }) => {
										return (
											<TransactionLogList
												_suspense={"I know"}
												noHero
												locale={locale}
												side="buyer"
												listingTransaction={data}
												query={{
													where: {
														listingTransactionId: data.id,
													},
													sort: [
														{
															field: "createdAt",
															direction: "asc",
														},
													],
												}}
											/>
										);
									}}
								</withListingTransactionFetchQuery.Suspense>
							</Suspense>
						</BottomSheet>
					</>
				) : (
					<ListingTransactionCreateButton
						tone={"primary"}
						listing={listing}
					/>
				)}

				{tools.includes("cart") ? (
					<Button
						label={
							listing.isInCart ? "Remove from cart (button)" : "Add to cart (button)"
						}
						iconEnabled={listing.isInCart ? FavouriteIcon : FavouriteOffIcon}
						iconPosition={"right"}
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
								iconPosition={"right"}
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
										iconPosition={"right"}
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
