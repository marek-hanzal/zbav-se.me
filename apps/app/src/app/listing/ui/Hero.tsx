import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Overlay } from "@use-pico/client/ui/overlay";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";
import { useListingScore } from "~/app/listing/hook/useListingScore";
import type { ListingDetail } from "~/app/listing/ui/ListingDetail";
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
		feedId: string | undefined;
		withScore: boolean;
		heroImageProps?: HeroImage.Props;
		tools: ListingDetail.Tools[];
	}
}

/**
 * Listing hero is a preview card for a single listing, typically rendered inside feed or listing lists while keeping actions reachable.
 *
 * @param props Component props extending `Container.Props`.
 */
export const Hero: FC<Hero.Props> = ({
	ref,
	listing,
	feedId,
	withScore,
	tools,
	heroImageProps,
	...props
}) => {
	const hero = useHeroUpload(listing.gallery.items);

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
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					visible
					invisible={
						<SpinnerContainer
							data-ui={"ListingHeroContainer-[SpinnerContainer.invisible]"}
						/>
					}
					{...heroImageProps}
				/>
			</Container>

			<ListingSheet
				listing={listing}
				data-id={listing.id}
				state={{
					value: detail,
					set: setDetail,
				}}
				withScore={withScore}
				feedId={feedId}
				tools={tools}
			/>
		</>
	);
};
