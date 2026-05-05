import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { useView } from "@/lib/client/view";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { SellerInfo } from "~/buyer/listing/SellerInfo/SellerInfo";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { getRootLogger } from "~/common/log/getRootLogger";
import { ListingCard } from "../ListingCard";

export namespace ListingSheet {
	export interface Props extends BottomSheet.PropsEx, MarkSuspense.Props {
		feedId: string;
		listingId: string;
		state: StateType.State<boolean>;
	}
}

export const ListingSheet: FC<ListingSheet.Props> = ({
	_suspense,
	feedId,
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
			"seller-info",
		],
		defaultPanel: "default",
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
			>
				<view.Panel name="default">
					<ListingCard
						_suspense={"I know"}
						feedId={feedId}
						listingId={listing.id}
						view={view}
					/>
				</view.Panel>

				<view.Panel name="gallery">
					<GalleryPreview
						urls={listing.withImageUrl}
						onClick={() => {
							view.set("default");
						}}
					/>
				</view.Panel>

				<view.Panel name="seller-info">
					<SellerInfo
						_suspense={"I know"}
						listingId={listingId}
						data-ui-inner="default"
					/>
				</view.Panel>
			</BottomSheet>
		</view.View>
	);
};
