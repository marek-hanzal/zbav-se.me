import { type FC, type PropsWithChildren, Suspense, useCallback, useMemo, useState } from "react";
import { CloseIcon } from "@/lib/client/icon";
import { SheetView } from "@/lib/client/sheet-view";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { SellerInfo } from "~/buyer/listing/SellerInfo/SellerInfo";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { CloseButton } from "~/common/ui/button";
import { ListingCard } from "../ListingCard";

export namespace ListingSheet {
	export type View = "default" | "gallery" | "seller-info";

	export interface Props extends PropsWithChildren, SheetView.PropsEx<View>, MarkSuspense.Props {
		feedId: string;
		listingId: string;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({
	_suspense,
	feedId,
	listingId,
	onClose,
	children,
	...props
}) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [view, setView] = useState<ListingSheet.View>("default");

	const $onClose = useCallback(() => {
		setView("default");
	}, []);

	const views = useMemo<SheetView.Views<ListingSheet.View>>(() => {
		return {
			default: {
				children: (
					<ListingCard
						_suspense={"I know"}
						feedId={feedId}
						listingId={listing.id}
						onView={setView}
					/>
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
						_suspense={"I know"}
						listingId={listingId}
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
		listingId,
		listing,
		$onClose,
	]);

	return (
		<Suspense fallback={<SpinnerContainer />}>
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
		</Suspense>
	);
};
