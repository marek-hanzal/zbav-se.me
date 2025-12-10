import type { Badge } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { StateType } from "@use-pico/common/type";
import type { tGalleryItem, tListingTransaction, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, Suspense } from "react";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";
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

	return (
		<>
			<Container
				data-ui={"TransactionItem[Container]"}
				data-id={listingTransaction.id}
				onClick={() => open.set(listingTransaction.id)}
				ui={{
					round: "default",
					position: "relative",
					shadow: true,
					border: true,
					...ui,
				}}
				className={[
					"h-72",
				]}
				{...props}
			>
				<HeroImage
					data-ui={"TransactionItem-[HeroImage]"}
					src={hero.upload.url}
					alt={`Hero image for listing transaction ${listingTransaction.id}`}
					visible
					round={"default"}
				/>

				<ListingOverlay
					data-ui={"TransactionItem-[ListingOverlay]"}
					locale={locale}
					listing={listingTransaction}
				/>
			</Container>

			<BottomSheet
				data-ui={"TransactionItem-[BottomSheet]"}
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
						data-ui={"TransactionItem-[TransactionLogList]"}
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
