import { Container } from "@use-pico/client/ui/container";
import type { tListing } from "@zbav-se.me/sdk/api/buyer-user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { FavouriteButtonSuspense } from "~/app/v0/@buyer-user/listing/ui/button/FavouriteButtonSuspense";
import { TransactionButton } from "~/app/v0/@buyer-user/listing/ui/button/TransactionButton";
import { ListingOverlay } from "~/app/v0/@buyer-user/listing/ui/ListingOverlay";
import { useHeroUpload } from "~/app/v0/@common/gallery/hook/useHeroUpload";

export namespace ListingHeroSection {
	export interface Props {
		feedId: string | undefined;
		listing: tListing;
		onGallery(): void;
		onTransaction(): void;
	}
}

export const ListingHeroSection: FC<ListingHeroSection.Props> = ({
	feedId,
	listing,
	onGallery,
	onTransaction,
}) => {
	const hero = useHeroUpload(listing.gallery.items);

	return (
		<>
			<Container
				data-ui={"ListingDetail-[Container.hero]"}
				ui={{
					position: "relative",
				}}
			>
				<ListingOverlay
					data-ui={"ListingDetail-[ListingOverlay]"}
					listing={listing}
				/>

				{feedId ? (
					<FavouriteButtonSuspense
						feedId={feedId}
						listingId={listing.id}
						label={null}
						iconProps={{
							ui: {
								text: "xl",
							},
						}}
						ui={{
							tone: "secondary",
							theme: "light",
							round: "full",
							square: "md",
							justify: "center",
							items: "center",
							size: undefined,
							inner: undefined,
							snapTo: "top-right",
						}}
					/>
				) : null}

				<HeroImage
					data-ui={"ListingDetail-[HeroImage]"}
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					onClick={onGallery}
					ui={{
						round: "default",
					}}
					className={"h-64"}
				/>
			</Container>

			<TransactionButton
				listing={listing}
				onTransaction={onTransaction}
			/>
		</>
	);
};
