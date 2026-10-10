import { GalleryPreview } from "~/common/gallery/ui/GalleryPreview";
import { AttrSection } from "~/common/listing-attr/ui/AttrSection";
import { getRootLogger } from "~/common/log/getRootLogger";
import { CloseButton } from "~/common/ui/button/CloseButton";
import { withFallback } from "~/ui/fn/withFallback";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { BottomSheet } from "~/ui/ui/BottomSheet";
import { Container } from "~/ui/ui/Container";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { useView } from "~/view/hook/useView";
import { withListingQuery } from "../../query/withListingQuery";
import { HeroSection } from "./section/HeroSection";
import { InfoSection } from "./section/InfoSection";

export namespace ListingCard {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingCard = withFallback(({ _suspense, listingId, ...props }: ListingCard.Props) => {
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
						view.set("default");
					}}
				/>
			</view.Panel>
		</view.View>
	);
}, SpinnerContainer);
