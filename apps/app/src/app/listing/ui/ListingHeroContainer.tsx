import { useVisibilityContext } from "@use-pico/client/context";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Overlay } from "@use-pico/client/ui/overlay";
import type { tGalleryItem, tListing } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type ReactNode, useId, useState } from "react";
import { useListingScore } from "~/app/listing/hook/useListingScore";
import { ListingDetailContainer } from "~/app/listing/ui/ListingDetailContainer";

export namespace ListingHeroContainer {
	export namespace Overlay {
		export interface Props {
			listing: tListing;
		}

		export type Render = (props: Props) => ReactNode;
	}

	/**
	 * Props for `ListingHeroContainer`.
	 */
	export interface Props extends Container.Props {
		locale: string;
		/**
		 * Listing entity shown inside the hero preview.
		 */
		listing: tListing;
		overlay: Overlay.Render;
		feedId: string;
	}
}

/**
 * Listing hero is a preview card for a single listing, typically rendered inside feed or listing lists while keeping actions reachable.
 *
 * @param props Component props extending `Container.Props`.
 */
export const ListingHeroContainer: FC<ListingHeroContainer.Props> = ({
	locale,
	ref,
	listing,
	feedId,
	overlay,
	tweak,
	...props
}) => {
	const [hero] = listing.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	const detailSheetId = useId();
	const [detail, setDetail] = useState(false);

	const useVisibilityStore = useVisibilityContext();
	const visible = useVisibilityStore((store) => store.isVisible);

	useListingScore({
		enabled: true,
		listingId: listing.id,
		type: "listing",
		timeoutMs: 1_600,
	});

	return (
		<>
			<Container
				data-id={listing.id}
				ui={"ListingHero-root"}
				position={"relative"}
				onClick={() => {
					setDetail((prev) => !prev);
				}}
				{...props}
			>
				{listing.isIgnored ? (
					<Overlay
						tweak={{
							slot: {
								root: {
									class: [
										"bg-rose-600/20",
										"opacity-80",
									],
								},
							},
						}}
					/>
				) : null}

				{overlay({
					listing,
				})}

				<HeroImage
					ui={"ListingHero-image"}
					src={hero.upload.url}
					alt={`Hero image for listing ${listing.id}`}
					visible={visible}
					invisible={<SpinnerContainer ui={"ListingHero-spinner"} />}
				/>
			</Container>

			<BottomSheet
				id={detailSheetId}
				isOpen={detail}
				onClose={() => setDetail(false)}
				detent={"full"}
				header={{
					close: true,
					title: listing.title,
				}}
			>
				<ListingDetailContainer
					parentSheetId={detailSheetId}
					locale={locale}
					listing={listing}
					withScore
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
