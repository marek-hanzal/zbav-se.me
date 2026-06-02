import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { useView } from "@/lib/client/view";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { getRootLogger } from "~/common/log/getRootLogger";
import { CloseButton } from "~/common/ui/button";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { ListingCard } from "./ListingCard";

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
