import type { FC } from "react";
import { GalleryPreview } from "~/gallery/ui/GalleryPreview";
import type { ListingSchema } from "~/seller-listing/schema/ListingSchema";
import { ListingCard } from "~/seller-listing/ui/ListingCard";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { StateType } from "~/ui/type/StateType";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { useView } from "~/view/hook/useView";

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

	return (
		<view.View>
			<BottomSheet
				data-ui={"ListingSheet"}
				isOpen={state.value}
				onClose={() => {
					state.setFn(false);
					view.setFn("default");
				}}
				detent={"default"}
				{...props}
			>
				<view.Panel name="default">
					<ListingCard
						_suspense={"I know"}
						data-ui={"ListingSheet-[ListingCardContainer]"}
						listing={listing}
						data-ui-inner="default"
						hooks={{
							onGalleryFn() {
								view.setFn("gallery");
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
