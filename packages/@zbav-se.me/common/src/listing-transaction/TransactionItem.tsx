import { Badge } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { StateType } from "@use-pico/common/type";
import type { tGalleryItem, tListingTransaction, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, Suspense } from "react";
import { ListingLocation } from "../listing/ListingLocation";
import { ListingPrice } from "../listing/ListingPrice";
import { TransactionLogList } from "../listing-transaction-log/TransactionLogList";

export namespace TransactionItem {
	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		side: tUserSideEnum;
		listingTransaction: tListingTransaction;
		open: StateType.Simple<string | undefined>;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	locale,
	side,
	listingTransaction,
	tweak,
	open,
	...props
}) => {
	const [hero] = listingTransaction.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	return (
		<>
			<Badge
				data-id={listingTransaction.id}
				size={"xl"}
				tweak={[
					tweak,
					{
						slot: {
							root: {
								class: [
									"flex",
									"flex-col",
									"gap-4",
									"h-72",
									"w-full",
									"items-start",
									"p-0",
									"relative",
									"border-none",
								],
							},
						},
					},
				]}
				round={"default"}
				onClick={() => open.set(listingTransaction.id)}
				{...props}
			>
				<HeroImage
					ui={"TransactionItem-image"}
					src={hero.upload.url}
					alt={`Hero image for listing transaction ${listingTransaction.id}`}
					visible
					round
				/>

				<ListingPrice
					price={listingTransaction.price}
					locale={locale}
					currency={listingTransaction.currency}
					snapTo={"top-center"}
				/>

				<ListingLocation
					location={listingTransaction.location}
					snapTo={"bottom"}
				>
					<Typo
						label={listingTransaction.title}
						truncate
						size={"sm"}
					/>
				</ListingLocation>
			</Badge>

			<BottomSheet
				isOpen={open.value === listingTransaction.id}
				onClose={() => open.set(undefined)}
				detent={"full"}
				contentProps={{
					disableScroll: true,
				}}
				header={{
					close: true,
					title: listingTransaction.title,
				}}
			>
				<Suspense fallback={<SpinnerContainer />}>
					<TransactionLogList
						_suspense={"I know"}
						locale={locale}
						side={side}
						listingTransaction={listingTransaction}
						query={{
							where: {
								listingTransactionId: listingTransaction.id,
							},
							sort: [
								{
									field: "createdAt",
									direction: "asc",
								},
							],
						}}
					/>
				</Suspense>
			</BottomSheet>
		</>
	);
};
