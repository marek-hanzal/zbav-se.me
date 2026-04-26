import { type FC, useMemo, useState } from "react";
import type { BottomSheet } from "@/lib/client/bottom-sheet";
import { CloseIcon } from "@/lib/client/icon";
import { SheetView } from "@/lib/client/sheet-view";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { CloseButton } from "~/common/ui/button";
import type { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";
import { ListingCard } from "./ListingCard";

export namespace ListingSheet {
	export type View = "detail" | "gallery";

	export interface Props extends BottomSheet.PropsEx, MarkSuspense.Props {
		listing: ListingSchema.Type;
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
						data-ui-inner="default"
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
				children: <GalleryPreview urls={listing.withImageUrl} />,
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
