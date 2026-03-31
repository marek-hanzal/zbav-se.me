import { type FC, type PropsWithChildren, Suspense, useCallback, useMemo, useState } from "react";
import { CloseIcon } from "@/lib/client/icon";
import { SheetView } from "@/lib/client/sheet-view";
import { SpinnerContainer } from "@/lib/client/spinner";
import { translator } from "@/lib/common/translator";
import { SellerInfo } from "~/buyer/listing/SellerInfo/SellerInfo";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { CloseButton } from "~/common/ui/button";
import { ListingCard } from "../ListingCard";

export namespace ListingSheet {
	export type View = "default" | "gallery" | "seller-info";

	export interface Props extends PropsWithChildren, SheetView.PropsEx<View> {
		feedId: string;
		listing: ListingSchema.Type;
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
					<ListingCard
						_suspense={"I know"}
						feedId={feedId}
						listingId={listing.id}
						onView={setView}
					>
						{children}
					</ListingCard>
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
