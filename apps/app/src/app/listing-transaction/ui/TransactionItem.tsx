import type { Badge } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { StateType } from "@use-pico/common/type";
import type { tGalleryItem, tListingTransaction, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, Suspense } from "react";
import { ListingLocation } from "~/app/listing/ui/ListingLocation";
import { ListingPrice } from "~/app/listing/ui/ListingPrice";
import { TransactionLogList } from "~/app/listing-transaction-log/ui/TransactionLogList";

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
	open,
	ui,
	...props
}) => {
	const [hero] = listingTransaction.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	// TODO Reuse ListingOverlay
	return (
		<>
			<Container
				data-ui={"TransactionItem[Container]"}
				data-id={listingTransaction.id}
				// tweak={[
				// 	tweak,
				// 	{
				// 		slot: {
				// 			root: {
				// 				class: [
				// 					"flex",
				// 					"flex-col",
				// 					"gap-4",
				// 					"h-72",
				// 					"w-full",
				// 					"items-start",
				// 					"p-0",
				// 					"relative",
				// 					"border-none",
				// 				],
				// 			},
				// 		},
				// 	},
				// ]}
				onClick={() => open.set(listingTransaction.id)}
				ui={{
					round: "default",
					position: "relative",
					...ui,
				}}
				{...props}
			>
				<HeroImage
					data-ui={"TransactionItem-HeroImage"}
					src={hero.upload.url}
					alt={`Hero image for listing transaction ${listingTransaction.id}`}
					visible
					round={"default"}
				/>

				<ListingPrice
					data-ui={"TransactionItem-[ListingPrice]"}
					price={listingTransaction.price}
					locale={locale}
					currency={listingTransaction.currency}
					ui={{
						snapTo: "top-center",
					}}
				/>

				<ListingLocation
					location={listingTransaction.location}
					ui={{
						snapTo: "bottom",
					}}
				>
					<Typo
						label={listingTransaction.title}
						ui={{
							text: "sm",
							truncate: true,
						}}
					/>
				</ListingLocation>
			</Container>

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
