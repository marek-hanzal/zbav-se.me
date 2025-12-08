import type { tListing } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { ListingLocation } from "~/app/listing/ui/ListingLocation";
import { ListingPrice } from "~/app/listing/ui/ListingPrice";

export namespace FeedListingOverlay {
	export interface Props {
		locale: string;
		listing: tListing;
	}
}

export const FeedListingOverlay: FC<FeedListingOverlay.Props> = ({ locale, listing }) => {
	return (
		<>
			<ListingPrice
				price={listing.price}
				locale={locale}
				currency={listing.currency}
				snapTo={"top-center"}
				opacity={"subtle"}
			/>

			<ListingLocation
				location={listing.location.address}
				snapTo={"bottom"}
				opacity={"subtle"}
			/>
		</>
	);
};
