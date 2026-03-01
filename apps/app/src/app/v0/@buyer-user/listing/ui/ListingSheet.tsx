import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tListing } from "@zbav-se.me/sdk/api/buyer-user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { SellerInfo } from "~/app/@buyer-session/listing/ui/SellerInfo";
import { GalleryPreview } from "~/app/@common/gallery/ui/GalleryPreview";
import { Transaction } from "~/app/v0/@buyer-user/transaction/ui/Transaction";
import { ListingDetail } from "./ListingDetail";

export namespace ListingSheet {
	export type View = "detail" | "messages" | "gallery" | "seller-info";

	export interface Props extends BottomSheet.PropsEx {
		listing: tListing;
		state: StateType.State<boolean>;
		withScore: boolean;
		feedId: string | undefined;
		tools: ListingDetail.Tools[];
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({
	listing,
	state,
	withScore,
	feedId,
	tools,
	...props
}) => {
	const [view, setView] = useState<ListingSheet.View>("detail");

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
			detent={"default"}
			views={{
				detail: {
					children: (
						<ListingDetail
							data-ui={"ListingSheet-[ListingDetailContainer]"}
							listing={listing}
							withScore={withScore}
							feedId={feedId}
							tools={tools}
							ui={{
								inner: "default",
							}}
							hooks={{
								onGallery: () => setView("gallery"),
								onTransaction: () => setView("messages"),
								onSellerInfo: () => setView("seller-info"),
							}}
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
						<GalleryPreview
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
					scroller: false,
				},
				messages: {
					children: listing.transactionId ? (
						<Transaction
							_suspense={"I know"}
							transactionId={listing.transactionId}
							refresh={2_500}
						/>
					) : null,
					header: () => ({
						title: translator.text("Listing messages (title)"),
						right: <CloseButton onClick={() => setView("detail")} />,
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
						right: <CloseButton onClick={() => setView("detail")} />,
					}),
				},
			}}
			{...props}
		/>
	);
};
