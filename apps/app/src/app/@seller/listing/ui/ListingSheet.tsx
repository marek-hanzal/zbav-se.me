import { CloseIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tListing } from "@zbav-se.me/sdk/api/seller";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useMemo, useState } from "react";
import { GalleryPreview } from "~/app/@common/gallery/ui/GalleryPreview";
import { ListingCard } from "./ListingCard";

export namespace ListingSheet {
	export type View = "detail" | "gallery";

	export interface Props extends BottomSheet.PropsEx, MarkSuspense.Props {
		listing: tListing;
		state: StateType.State<boolean>;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({ _suspense, listing, state, ...props }) => {
	const [view, setView] = useState<ListingSheet.View>("detail");

	const views = useMemo<SheetView.Views<ListingSheet.View>>(() => {
		return {
			detail: {
				children: (
					<ListingCard
						_suspense={"I know"}
						data-ui={"ListingSheet-[ListingCardContainer]"}
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
					right: (
						<CloseButton
							iconEnabled={CloseIcon}
							onClick={() => setView("detail")}
						/>
					),
				}),
			},
		};
	}, [
		listing,
	]);

	return (
		<SheetView<ListingSheet.View>
			data-ui={"ListingSheet"}
			isOpen={state.value}
			onClose={() => {
				state.set(false);
				setView("detail");
			}}
			state={{
				value: view,
				set: setView,
			}}
			detent={"default"}
			views={views}
			{...props}
		/>
	);
};
