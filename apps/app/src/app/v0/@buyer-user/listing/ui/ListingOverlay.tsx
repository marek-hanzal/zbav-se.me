import type { tListing } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { ListingPrice } from "~/app/@common/listing/ui/ListingPrice";
import { LocationBadge } from "~/app/@common/location/ui/LocationBadge";

export namespace ListingOverlay {
	export interface Props {
		listing: Pick<tListing, "price" | "priceType" | "currency" | "location" | "distance">;
	}
}

export const ListingOverlay: FC<ListingOverlay.Props> = ({ listing }) => {
	return (
		<>
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
		</>
	);
};
