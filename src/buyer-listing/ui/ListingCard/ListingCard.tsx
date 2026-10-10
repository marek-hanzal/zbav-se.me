import { CloseButton } from "~/application-ui/ui/button.exports";
import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import { HeroSection } from "~/buyer-listing/ui/ListingCard/HeroSection";
import { InfoSection } from "~/buyer-listing/ui/ListingCard/InfoSection";
import { SellerInfoPreview } from "~/buyer-listing/ui/ListingCard/SellerInfoPreview";
import { ShareButton } from "~/buyer-listing/ui/ListingCard/ShareButton";
import { SellerInfo } from "~/buyer-listing/ui/SellerInfo/index";
import { GalleryPreview } from "~/gallery/ui/GalleryPreview";
import { AttrSection } from "~/listing-attr/ui/AttrSection";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { CloseIcon } from "~/ui/constant/CloseIcon";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { BottomSheet } from "~/ui/ui/BottomSheet";
import { Container } from "~/ui/ui/Container";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { useView } from "~/view/hook/useView";

export namespace ListingCard {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingCard = withFallbackFn(
	({ _suspense, listingId, ...props }: ListingCard.Props) => {
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
						data-ui={"ListingCard[Container]"}
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
							view.setFn("default");
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
	},
	SpinnerContainer,
);
