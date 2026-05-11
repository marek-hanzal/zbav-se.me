import type { FC } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { CloseIcon } from "@/lib/client/icon";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { useView } from "@/lib/client/view";
import { translator } from "@/lib/common/translation";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { SellerInfo } from "~/buyer/listing/SellerInfo/SellerInfo";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { getRootLogger } from "~/common/log/getRootLogger";
import { CloseButton } from "~/common/ui/button";
import { ListingCard } from "./ListingCard";

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
		props: {
			default: {
				header({ close }) {
					return {
						title: listing.title,
						right: <CloseButton onClick={close} />,
					};
				},
			} satisfies BottomSheet.PropsEx,
			"seller-info": {
				header() {
					return {
						title: translator.text("Seller info (title)"),
						right: (
							<CloseButton
								iconEnabled={CloseIcon}
								onClick={() => view.set("default")}
							/>
						),
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
				<view.Panel
					name="default"
					keep
				>
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
