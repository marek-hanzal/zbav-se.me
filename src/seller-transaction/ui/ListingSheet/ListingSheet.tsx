import type { FC } from "react";
import { CloseButton } from "~/application-ui/ui/button.exports";
import { GalleryPreview } from "~/gallery/ui/GalleryPreview";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { ListingCard } from "~/seller-transaction/ui/ListingSheet/ListingCard/index";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { StateType } from "~/ui/type/StateType";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { useView } from "~/view/hook/useView";

export namespace ListingSheet {
	export interface Props extends BottomSheet.PropsEx, MarkSuspense.Props {
		listingId: string;
		state: StateType.State<boolean>;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({
	_suspense,
	listingId,
	state,
	children,
	...props
}) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const view = useView({
		panels: [
			"default",
			"gallery",
		],
		defaultPanel: "default",
		props: {
			default: {
				header({ close }) {
					return {
						title: listing.title,
						right: <CloseButton onClick={close} />,
					};
				},
			} satisfies BottomSheet.PropsEx,
		},
	});

	useRenderLogger({
		logger: getRootLogger(),
		name: "ListingSheet",
		meta: {
			listingId,
		},
	});

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
				{...props}
				{...view.props}
			>
				<view.Panel name="default">
					<ListingCard
						_suspense={_suspense}
						listingId={listing.id}
						view={view}
						onClick={() => {
							state.set(false);
						}}
					/>
				</view.Panel>

				<view.Panel name="gallery">
					<GalleryPreview
						urls={listing.withImageUrl}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							view.set("default");
						}}
					/>
				</view.Panel>
			</BottomSheet>
		</view.View>
	);
};
