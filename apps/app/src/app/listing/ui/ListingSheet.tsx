import type { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { SheetView } from "@use-pico/client/ui/sheet-view";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { ListingDetail } from "~/app/listing/ui/ListingDetail";
import { SellerInfo } from "~/app/listing/ui/SellerInfo";
import { GalleryContent } from "~/app/photo/ui/GalleryContent";
import { Transaction } from "~/app/transaction/ui/buyer/Transaction";

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
			detent={"full"}
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
					scroller: false,
				},
				messages: {
					children: listing.transactionId ? (
						<Transaction
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
