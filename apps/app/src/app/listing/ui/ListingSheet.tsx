import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { ListingDetail } from "~/app/listing/ui/ListingDetail";
import { Metrics } from "~/app/listing/ui/Metrics";
import { GalleryContent } from "~/app/photo/ui/GalleryContent";

export namespace ListingSheet {
	export type View = "detail" | "messages" | "metrics" | "gallery";

	export interface Props extends BottomSheet.PropsEx {
		locale: string;
		listing: tListing;
		state: StateType.State<boolean>;
		withScore: boolean;
		feedId: string | undefined;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({
	locale,
	listing,
	state,
	withScore,
	feedId,
	...props
}) => {
	const [view, setView] = useState<ListingSheet.View>("detail");

	return (
		<SheetView<ListingSheet.View>
			isOpen={state.value}
			onClose={() => state.set(false)}
			state={{
				value: view,
				set: setView,
			}}
			detent={"full"}
			views={{
				detail: {
					children: (
						<ListingDetail
							data-ui={"ListingSheet-[ListingDetailContainer]"}
							locale={locale}
							listing={listing}
							withScore={withScore}
							feedId={feedId}
							tools={[
								"destructive",
								"hero",
							]}
							ui={{
								inner: "default",
							}}
							hooks={{
								onGallery: () => setView("gallery"),
								onScore: () => setView("metrics"),
								onTransaction: () => setView("messages"),
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
						<GalleryContent
							uploads={listing.gallery.items.map((item) => item.upload)}
						/>
					),
					header: () => ({
						title: translator.text("Listing gallery (title)"),
						right: <CloseButton onClick={() => setView("detail")} />,
					}),
					contentProps: {
						disableScroll: true,
					},
				},
				metrics: {
					children: (
						<Metrics
							locale={locale}
							listingId={listing.id}
							ui={{
								inner: "default",
							}}
						/>
					),
					header: () => ({
						title: translator.text("Listing metrics (title)"),
						right: <CloseButton onClick={() => setView("detail")} />,
					}),
				},
				messages: {
					children: "messagesd",
					header: () => ({
						title: translator.text("Listing messages (title)"),
						right: <CloseButton onClick={() => setView("detail")} />,
					}),
				},
			}}
			{...props}
		/>
	);
};
