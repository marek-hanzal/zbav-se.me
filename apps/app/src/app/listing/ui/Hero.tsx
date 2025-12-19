import { useVisibilityContext } from "@use-pico/client/context";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Overlay } from "@use-pico/client/ui/overlay";
import type { tGalleryItem, tListing } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useListingScore } from "~/app/listing/hook/useListingScore";
import { ListingSheet } from "~/app/listing/ui/ListingSheet";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";

export namespace Hero {
	/**
	 * Props for `ListingHeroContainer`.
	 */
	export interface Props extends Container.Props {
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
export const Hero: FC<Hero.Props> = ({ ref, listing, feedId, withScore, ...props }) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	const useVisibilityStore = useVisibilityContext();
	const visible = useVisibilityStore((store) => store.isVisible);

	const [detail, setDetail] = useState<boolean>(false);

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
				onClick={() => setDetail((prev) => !prev)}
				{...props}
			>
				{listing.isIgnored ? <Overlay type={"subtle"} /> : null}

				<ListingOverlay
					data-ui={"ListingHeroContainer-[ListingOverlay]"}
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

			{visible ? (
				<ListingSheet
					listing={listing}
					state={{
						value: detail,
						set: setDetail,
					}}
					withScore={withScore}
					feedId={feedId}
					tools={[
						"destructive",
						"hero",
					]}
				/>
			) : null}
		</>
	);
};
