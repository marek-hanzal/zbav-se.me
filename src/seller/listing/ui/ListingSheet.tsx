import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { useView } from "@/lib/client/view";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import type { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";
import { ListingCard } from "./ListingCard";

export namespace ListingSheet {
	export interface Props extends BottomSheet.PropsEx, MarkSuspense.Props {
		listing: ListingSchema.Type;
		state: StateType.State<boolean>;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({ _suspense, listing, state, ...props }) => {
	const view = useView({
		panels: [
			"default",
			"gallery",
		],
		defaultPanel: "default",
	});

	// const views = useMemo<SheetView.Views<ListingSheet.View>>(() => {
	// 	return {
	// 		detail: {
	// 			children: (
	// 				<ListingCard
	// 					_suspense={"I know"}
	// 					data-ui={"ListingSheet-[ListingCardContainer]"}
	// 					listing={listing}
	// 					data-ui-inner="default"
	// 					hooks={{
	// 						onGallery: () => setView("gallery"),
	// 					}}
	// 				/>
	// 			),
	// 			header: ({ close }) => ({
	// 				title: "listing.title",
	// 				right: <CloseButton onClick={close} />,
	// 			}),
	// 		},
	// 		gallery: {
	// 			children: ,
	// 			header: () => ({
	// 				title: translator.text("Listing gallery (title)"),
	// 				right: (
	// 					<CloseButton
	// 						iconEnabled={CloseIcon}
	// 						onClick={() => setView("detail")}
	// 					/>
	// 				),
	// 			}),
	// 		},
	// 	};
	// }, [
	// 	listing,
	// ]);

	return (
		<view.View>
			<BottomSheet
				data-ui={"ListingSheet"}
				isOpen={state.value}
				onClose={() => {
					state.set(false);
					view.set("default");
				}}
				detent={"default"}
			>
				<view.Panel name="default">
					<ListingCard
						_suspense={"I know"}
						data-ui={"ListingSheet-[ListingCardContainer]"}
						listing={listing}
						data-ui-inner="default"
						hooks={{
							onGallery() {
								view.set("gallery");
							},
						}}
					/>
				</view.Panel>

				<view.Panel name={"gallery"}>
					<GalleryPreview urls={listing.withImageUrl} />
				</view.Panel>
			</BottomSheet>
		</view.View>
	);
};
