import { useVisibilityContext } from "@use-pico/client/context";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Overlay } from "@use-pico/client/ui/overlay";
import type { tGalleryItem, tListing } from "@zbav-se.me/sdk/api/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useId, useState } from "react";
import { useListingScore } from "~/app/listing/hook/useListingScore";
import { ListingDetail } from "~/app/listing/ui/ListingDetail";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";

export namespace Hero {
	/**
	 * Props for `ListingHeroContainer`.
	 */
	export interface Props extends Container.Props {
		locale: string;
		/**
		 * Listing entity shown inside the hero preview.
		 */
		listing: tListing;
		feedId: string;
		withScore: boolean;
	}
}

/**
 * Listing hero is a preview card for a single listing, typically rendered inside feed or listing lists while keeping actions reachable.
 *
 * @param props Component props extending `Container.Props`.
 */
export const Hero: FC<Hero.Props> = ({ locale, ref, listing, feedId, withScore, ...props }) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	const detailSheetId = useId();
	const [detail, setDetail] = useState(false);

	const useVisibilityStore = useVisibilityContext();
	const visible = useVisibilityStore((store) => store.isVisible);

	useListingScore({
		enabled: withScore,
		listingId: listing.id,
		type: "listing",
		timeoutMs: 1_600,
	});

	return (
		<>
			<Container
				data-id={listing.id}
				data-ui={"ListingHeroContainer[Container]"}
				ui={{
					height: "full",
					width: "full",
					position: "relative",
				}}
				onClick={() => {
					setDetail((prev) => !prev);
				}}
				{...props}
			>
				{listing.isIgnored ? <Overlay type={"subtle"} /> : null}

				<ListingOverlay
					data-ui={"ListingHeroContainer-[ListingOverlay]"}
					locale={locale}
					listing={listing}
				/>

				<HeroImage
					data-ui={"ListingHeroContainer-[HeroImage]"}
					src={hero.upload.url}
					alt={`Hero image for listing ${listing.id}`}
					visible={visible}
					invisible={
						<SpinnerContainer
							data-ui={"ListingHeroContainer-[SpinnerContainer.invisible]"}
						/>
					}
				/>
			</Container>

			<BottomSheet
				data-ui={"ListingHeroContainer-[BottomSheet]"}
				data-id={listing.id}
				id={detailSheetId}
				isOpen={detail}
				onClose={() => setDetail(false)}
				detent={"full"}
				header={({ close }) => ({
					title: listing.title,
					right: <CloseButton onClick={close} />,
				})}
			>
				<ListingDetail
					data-ui={"ListingHeroContainer-[ListingDetailContainer]"}
					parentSheetId={detailSheetId}
					locale={locale}
					listing={listing}
					withScore={withScore}
					feedId={feedId}
					tools={[
						"destructive",
						"hero",
					]}
				/>
			</BottomSheet>
		</>
	);
};
