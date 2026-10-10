import type { FC } from "react";
import { CloseButton } from "~/application-ui/ui/button.exports";
import { ListingCard } from "~/buyer-feed/ui/ListingCard/index";
import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import { SellerInfo } from "~/buyer-listing/ui/SellerInfo/SellerInfo";
import { GalleryPreview } from "~/gallery/ui/GalleryPreview";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { CloseIcon } from "~/ui/constant/CloseIcon";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { StateType } from "~/ui/type/StateType";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { useView } from "~/view/hook/useView";

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
	const translator = useTranslator();
	const view = useView({
		panels: [
			"default",
			"gallery",
			"seller-info",
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
			"seller-info": {
				headerFn() {
					return {
						title: translator.textFn("Seller info (title)"),
						right: (
							<CloseButton
								iconEnabled={CloseIcon}
								onClick={() => view.setFn("default")}
							/>
						),
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
				data-ui={"ListingSheet[BottomSheet]"}
				isOpen={state.value}
				onClose={() => {
					state.setFn(false);
					view.setFn("default");
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
							view.setFn("default");
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
