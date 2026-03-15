import { CloseIcon } from "@use-pico/client/icon";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { tListing } from "@zbav-se.me/sdk/api/buyer";
import { CloseButton } from "@zbav-se.me/ui/button";
import { Suspense, type FC, type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { SellerInfo } from "~/app/@buyer/listing/~public/SellerInfo";
import { GalleryPreview } from "~/app/@common/gallery/ui/GalleryPreview";
import { ListingCard } from "../ListingCard";

export namespace ListingSheet {
	export type View = "default" | "gallery" | "seller-info";

	export interface Props extends PropsWithChildren, SheetView.PropsEx<View> {
		feedId: string;
		listing: tListing;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({
	feedId,
	listing,
	onClose,
	children,
	...props
}) => {
	const [view, setView] = useState<ListingSheet.View>("default");

	const $onClose = useCallback(() => {
		setView("default");
	}, []);

	const views = useMemo<SheetView.Views<ListingSheet.View>>(() => {
		return {
			default: {
				children: (
					<Suspense fallback={<ListingCard.Fallback />}>
						<ListingCard
							_suspense={"I know"}
							feedId={feedId}
							listingId={listing.id}
							onView={setView}
						>
							{children}
						</ListingCard>
					</Suspense>
				),
				header: ({ close }) => ({
					title: listing.title,
					right: (
						<CloseButton
							data-action={"close listing detail"}
							onClick={close}
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
					right: (
						<CloseButton
							data-action={"close listing gallery"}
							iconEnabled={CloseIcon}
							onClick={$onClose}
						/>
					),
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
					right: (
						<CloseButton
							data-action={"close seller info"}
							iconEnabled={CloseIcon}
							onClick={$onClose}
						/>
					),
				}),
			},
		};
	}, [
		feedId,
		listing,
		$onClose,
		children,
	]);

	return (
		<SheetView<ListingSheet.View>
			data-ui={"ListingSheet"}
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
