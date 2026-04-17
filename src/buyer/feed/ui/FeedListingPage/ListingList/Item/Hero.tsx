import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Overlay } from "@/lib/client/overlay";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { LocationBadge } from "~/common/location/ui/LocationBadge";
import { HeroImage } from "~/common/ui/img";

export namespace Hero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		state: StateType.State<boolean>;
	}
}

export const Hero: FC<Hero.Props> = ({ listingId, state, ...props }) => {
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.gallery.items);

	return (
		<Container
			data-id={listing.id}
			data-ui={"Item"}
			data-action={"open listing detail"}
			ui={{
				height: "full",
				width: "full",
				position: "relative",
			}}
			onClick={() => state.set((prev) => !prev)}
			{...props}
		>
			{listing.isIgnored ? (
				<Overlay
					ui={{
						type: "subtle",
					}}
				/>
			) : null}

			<ListingPrice
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
				location={listing.location}
				distance={listing.distance}
				ui={{
					snapTo: "bottom",
					opacity: "8",
					zIndex: true,
				}}
			/>

			<HeroImage
				src={hero.url}
				alt={`Hero image for listing ${listing.id}`}
				visible
				invisible={<SpinnerContainer />}
			/>
		</Container>
	);
};
