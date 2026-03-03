import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Overlay } from "@use-pico/client/ui/overlay";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useListingEvent } from "~/app/@buyer/listing/~public/useListingEvent";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { ListingPrice } from "~/app/@common/listing/ui/ListingPrice";
import { LocationBadge } from "~/app/@common/location/ui/LocationBadge";
import { ListingSheet } from "../../ListingSheet/ListingSheet";

export namespace Data {
	export interface Props extends Container.Props {
		listingId: string;
		feedId: string;
		withScore: boolean;
	}
}

export const Data: FC<Data.Props> = ({ listingId, feedId, withScore, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const [detail, setDetail] = useState<boolean>(false);
	const hero = useUpload(listing.gallery.items);

	useListingEvent({
		enabled: withScore,
		listingId: listing.id,
		event: "impression",
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

				<ListingPrice
					data-ui={"ListingOverlay-[ListingPrice]"}
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
					data-ui={"ListingOverlay-[LocationBadge]"}
					location={listing.location}
					distance={listing.distance}
					ui={{
						snapTo: "bottom",
						opacity: "8",
						zIndex: true,
					}}
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
				/>
			</Container>

			<ListingSheet
				feedId={feedId}
				listing={listing}
				isOpen={detail}
				onClose={() => setDetail(false)}
			>
				hej, pyco!
			</ListingSheet>
		</>
	);
};
