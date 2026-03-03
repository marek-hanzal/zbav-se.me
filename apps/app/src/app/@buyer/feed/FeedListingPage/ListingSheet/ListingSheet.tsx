import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { tListing } from "@zbav-se.me/sdk/api/buyer";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useCallback, useMemo, useState } from "react";
import { SellerInfo } from "~/app/@buyer/listing/~public/SellerInfo";
import { GalleryPreview } from "~/app/@common/gallery/ui/GalleryPreview";
import { Transaction } from "~/app/v0/@buyer/transaction/ui/Transaction";
import { ListingCard } from "../ListingCard/ListingCard";

export namespace ListingSheet {
	export type View = "default" | "transaction" | "gallery" | "seller-info";

	export interface Props extends SheetView.PropsEx<View> {
		feedId: string;
		listing: tListing;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({ feedId, listing, onClose, ...props }) => {
	const [view, setView] = useState<ListingSheet.View>("default");

	const $onClose = useCallback(() => {
		setView("default");
	}, []);

	const views = useMemo<SheetView.Views<ListingSheet.View>>(() => {
		return {
			default: {
				children: (
					<ListingCard
						feedId={feedId}
						listingId={listing.id}
						onView={setView}
					/>
				),
				header: ({ close }) => ({
					title: listing.title,
					right: (
						<CloseButton
							onClick={close}
							ui={{
								background: undefined,
								shadow: false,
								border: false,
							}}
						/>
					),
				}),
			},
			gallery: {
				children: (
					<GalleryPreview uploads={listing.gallery.items.map((item) => item.upload)} />
				),
				header: () => ({
					title: translator.text("Listing gallery (title)"),
					right: <CloseButton onClick={$onClose} />,
				}),
			},
			transaction: {
				children: listing.transactionId ? (
					<Transaction
						_suspense={"I know"}
						transactionId={listing.transactionId}
						refresh={2_500}
					/>
				) : null,
				header: () => ({
					title: translator.text("Listing messages (title)"),
					right: <CloseButton onClick={$onClose} />,
				}),
			},
			"seller-info": {
				children: (
					<SellerInfo
						listingId={listing.id}
						ui={{
							inner: "default",
						}}
					/>
				),
				header: () => ({
					title: translator.text("Seller info (title)"),
					right: <CloseButton onClick={$onClose} />,
				}),
			},
		};
	}, [
		feedId,
		listing,
		$onClose,
	]);

	return (
		<SheetView<ListingSheet.View>
			state={{
				value: view,
				set: setView,
			}}
			views={views}
			detent={"default"}
			onClose={() => {
				onClose();
				setView("default");
			}}
			{...props}
		/>
	);
};
