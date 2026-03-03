import { Container } from "@use-pico/client/ui/container";
import type { tListing } from "@zbav-se.me/sdk/api/buyer";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListingPrice } from "~/app/@common/listing/ui/ListingPrice";
import { LocationBadge } from "~/app/@common/location/ui/LocationBadge";
import { FavouriteButton } from "../../FavouriteButton/FavouriteButton";
import { TransactionButton } from "../../TransactionButton/TransactionButton";

export namespace HeroSection {
	export interface Props {
		feedId: string;
		listing: tListing;
		onView(view: "gallery" | "transaction"): void;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ feedId, listing, onView }) => {
	const hero = useUpload(listing.gallery.items);

	return (
		<>
			<Container
				data-ui={"HeroSection[Container]"}
				ui={{
					position: "relative",
				}}
			>
				<ListingPrice
					data-ui={"HeroSection-[ListingPrice]"}
					price={listing.price}
					priceType={listing.priceType}
					currency={listing.currency}
					ui={{
						snapTo: "top-center",
						opacity: "8",
						zIndex: true,
					}}
				/>

				<LocationBadge
					data-ui={"HeroSection-[LocationBadge]"}
					location={listing.location}
					distance={listing.distance}
					ui={{
						snapTo: "bottom",
						opacity: "8",
						zIndex: true,
					}}
				/>

				<FavouriteButton
					feedId={feedId}
					listingId={listing.id}
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

				<HeroImage
					data-ui={"HeroSection-[HeroImage]"}
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					onClick={() => onView("gallery")}
					ui={{
						round: "default",
					}}
					className={"h-64"}
				/>
			</Container>

			<TransactionButton
				listing={listing}
				onView={onView}
			/>
		</>
	);
};
