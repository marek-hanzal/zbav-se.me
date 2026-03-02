import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tListing } from "@zbav-se.me/sdk/api/seller";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useMemo, useState } from "react";
import { GalleryPreview } from "~/app/@common/gallery/ui/GalleryPreview";
import { ListingDetail } from "./ListingDetail";

export namespace ListingSheet {
	export type View = "detail" | "gallery";

	export interface Props extends BottomSheet.PropsEx {
		listing: tListing;
		state: StateType.State<boolean>;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({ listing, state, ...props }) => {
	const [view, setView] = useState<ListingSheet.View>("detail");

	const views = useMemo<SheetView.Views<ListingSheet.View>>(() => {
		return {
			detail: {
				children: (
					<ListingDetail
						data-ui={"ListingSheet-[ListingDetailContainer]"}
						listing={listing}
						ui={{
							inner: "default",
						}}
						hooks={{
							onGallery: () => setView("gallery"),
						}}
					/>
				),
				header: ({ close }) => ({
					title: listing.title,
					right: <CloseButton onClick={close} />,
				}),
			},
			gallery: {
				children: (
					<GalleryPreview uploads={listing.gallery.items.map((item) => item.upload)} />
				),
				header: () => ({
					title: translator.text("Listing gallery (title)"),
					right: <CloseButton onClick={() => setView("detail")} />,
				}),
				contentProps: {
					disableScroll: true,
				},
				scroller: false,
			},
		};
	}, [
		listing,
	]);

	return (
		<SheetView<ListingSheet.View>
			isOpen={state.value}
			onClose={() => {
				state.set(false);
				setView("detail");
			}}
			state={{
				value: view,
				set: setView,
			}}
			detent={"full"}
			views={views}
			{...props}
		/>
	);
};
