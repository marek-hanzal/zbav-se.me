import type { tListing } from "@zbav-se.me/sdk/api/seller";
import type { FC } from "react";
import { ListingPrice } from "~/app/@common/listing/ui/ListingPrice";

export namespace ListingOverlay {
	export interface Props {
		listing: Pick<tListing, "price" | "priceType" | "currency">;
	}
}

export const ListingOverlay: FC<ListingOverlay.Props> = ({ listing }) => {
	return (
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
	);
};
