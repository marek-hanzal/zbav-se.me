import type { FC } from "react";
import { CloseButton } from "~/application-ui/ui/button.exports";
import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import { ListingCard } from "~/buyer-transaction/ui/Transaction/ListingSheet/ListingCard/index";
import { GalleryPreview } from "~/gallery/ui/GalleryPreview";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
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
				headerFn({ closeFn }) {
					return {
						title: listing.title,
						right: <CloseButton onClick={closeFn} />,
					};
				},
			} satisfies BottomSheet.PropsEx,
		},
	});

	useRenderLogger({
		logger: getRootLoggerFn(),
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
					state.setFn(false);
					view.setFn("default");
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
							state.setFn(false);
						}}
					/>
				</view.Panel>

				<view.Panel name="gallery">
					<GalleryPreview
						urls={listing.withImageUrl}
						onClick={() => {
							view.setFn("default");
						}}
					/>
				</view.Panel>
			</BottomSheet>
		</view.View>
	);
};
