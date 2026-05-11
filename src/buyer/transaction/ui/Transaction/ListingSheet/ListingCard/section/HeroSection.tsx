import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { useView } from "@/lib/client/view";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { useUpload } from "~/common/gallery/hook/useUpload";
import type { ListingPriceSchema } from "~/common/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { LocationBadge } from "~/common/location/ui/LocationBadge";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";

export namespace HeroSection {
	export interface Props {
		listing: ListingSchema.Type;
		view: useView.Use<"gallery">;
	}
}

export const HeroSection: FC<HeroSection.Props> = ({ listing, view }) => {
	const hero = useUpload(listing.withImageUrl);

	useRenderLogger({
		logger: getRootLogger(),
		name: "HeroSection",
		meta: {
			listingId: listing.id,
		},
	});

	return (
		<Container
			data-ui={"HeroSection"}
			data-ui-position="relative"
		>
			<ListingPrice
				price={listing as ListingPriceSchema.Type}
				data-ui-snap-to="top-center"
				data-ui-opacity="8"
				data-ui-z-index
			/>

			<LocationBadge
				location={listing.location}
				distance={listing.distance}
				data-ui-snap-to="bottom"
				data-ui-opacity="8"
				data-ui-z-index
			/>

			<HeroImage
				src={hero}
				alt={`Hero image for listing ${listing.id}`}
				data-action={"open listing gallery"}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					view.set("gallery");
				}}
				data-ui-round="default"
				className={"h-64"}
			/>
		</Container>
	);
};
