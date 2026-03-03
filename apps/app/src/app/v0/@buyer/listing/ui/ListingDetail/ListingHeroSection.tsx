import { Container } from "@use-pico/client/ui/container";
import type { tListing } from "@zbav-se.me/sdk/api/buyer";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { TransactionButton } from "~/app/v0/@buyer/listing/ui/button/TransactionButton";
import { ListingOverlay } from "~/app/v0/@buyer/listing/ui/ListingOverlay";

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
	const hero = useUpload(listing.gallery.items);

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
