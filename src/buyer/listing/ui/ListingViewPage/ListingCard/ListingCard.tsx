import type { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { CloseIcon } from "@/lib/client/icon";
import { useRenderLogger } from "@/lib/client/log";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { useView } from "@/lib/client/view";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { SellerInfo } from "~/buyer/listing/SellerInfo";
import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { AttrSection } from "~/common/listing-attr/ui/AttrSection";
import { getRootLogger } from "~/common/log/getRootLogger";
import { CloseButton } from "~/common/ui/button";
import { SellerInfoPreview } from "./SellerInfoPreview";
import { ShareButton } from "./ShareButton";
import { HeroSection } from "./section/HeroSection";
import { InfoSection } from "./section/InfoSection";

export namespace ListingCard {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingCard = withFallback(({ _suspense, listingId, ...props }: ListingCard.Props) => {
	const translator = useTranslator();
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
		name: "ListingCard",
		meta: {
			listingId,
		},
	});

	return (
		<view.View>
			<view.Panel
				name="default"
				keep
			>
				<Container
					data-ui={"ListingCard"}
					data-ui-layout="vertical-flex"
					data-ui-gap="xl"
					data-ui-inner="default"
					{...props}
				>
					<HeroSection
						_suspense={_suspense}
						listing={listing}
						view={view}
					/>

					<InfoSection listing={listing} />

					<AttrSection
						_suspense={_suspense}
						listingId={listing.id}
						categoryId={listing.categoryId}
					/>

					{listing.my ? null : (
						<SellerInfoPreview
							_suspense={_suspense}
							listingId={listing.id}
							view={view}
						/>
					)}

					<ShareButton listingId={listing.id} />
				</Container>
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
					listingId={listing.id}
					data-ui-inner="default"
				/>
			</view.Panel>
		</view.View>
	);
}, SpinnerContainer);
