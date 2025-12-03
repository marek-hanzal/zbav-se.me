import { VariantProvider } from "@use-pico/cls";
import { ListingLocation, ListingPrice } from "@zbav-se.me/common/listing";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

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
			/>

			<VariantProvider
				cls={ThemeCls}
				variant={{
					tone: "secondary",
					theme: "light",
				}}
			>
				<ListingLocation
					location={listing.location.address}
					snapTo={"bottom"}
				/>
			</VariantProvider>
		</>
	);
};
