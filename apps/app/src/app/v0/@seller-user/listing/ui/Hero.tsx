import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tListing } from "@zbav-se.me/sdk/api/seller-user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListingOverlay } from "./ListingOverlay";
import { ListingSheet } from "./ListingSheet";

export namespace Hero {
	/**
	 * Props for `ListingHeroContainer`
	 */
	export interface Props extends Container.Props {
		/**
		 * Listing entity shown inside the hero preview.
		 */
		listing: tListing;
		heroImageProps?: HeroImage.Props;
	}
}

/**
 * Listing hero is a preview card for a single listing (seller view).
 *
 * @param props Component props extending `Container.Props`.
 */
export const Hero: FC<Hero.Props> = ({ ref, listing, heroImageProps, ...props }) => {
	const hero = useUpload(listing.gallery.items);

	const [detail, setDetail] = useState<boolean>(false);

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
			/>
		</>
	);
};
