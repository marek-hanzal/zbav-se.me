import { CloseButton } from "~/application-ui/ui/CloseButton";
import { GalleryPreview } from "~/gallery/ui/GalleryPreview";
import { AttrSection } from "~/listing-attr/ui/AttrSection";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withListingQuery } from "~/public-listing/query/withListingQuery";
import { HeroSection } from "~/public-listing/ui/ListingCard/HeroSection";
import { InfoSection } from "~/public-listing/ui/ListingCard/InfoSection";
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
			</view.View>
		);
	},
	SpinnerContainer,
);
