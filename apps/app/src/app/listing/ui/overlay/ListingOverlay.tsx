import type { tListing } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { ListingLocation } from "~/app/listing/ui/ListingLocation";
import { ListingPrice } from "~/app/listing/ui/ListingPrice";

export namespace ListingOverlay {
	export interface Props {
		locale: string;
		listing: Pick<tListing, "price" | "currency" | "location">;
	}
}

export const ListingOverlay: FC<ListingOverlay.Props> = ({ locale, listing }) => {
	return (
		<>
			<ListingPrice
				data-ui={"ListingOverlay-[ListingPrice]"}
				price={listing.price}
				locale={locale}
				currency={listing.currency}
				ui={{
					snapTo: "top-center",
					opacity: "low",
				}}
			/>

			<ListingLocation
				data-ui={"ListingOverlay-[ListingLocation]"}
				location={listing.location}
				ui={{
					snapTo: "bottom",
					opacity: "low",
				}}
			/>
		</>
	);
};
