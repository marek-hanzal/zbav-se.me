import { Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { VariantProvider } from "@use-pico/cls";
import { ListingPrice } from "@zbav-se.me/common/listing";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { RatingToIcon } from "@zbav-se.me/ui/rating";
import { ListingLocation } from "node_modules/@zbav-se.me/common/src/listing/ListingLocation";
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

			<Badge
				ui={"FeedListingOverlay-rating"}
				tone={"secondary"}
				size={"lg"}
				round={"full"}
				snapTo={"top-right"}
				tweak={{
					slot: {
						root: {
							class: [
								"p-2",
								"opacity-75",
								"h-fit",
							],
						},
					},
				}}
			>
				<Icon icon={RatingToIcon[listing.condition as RatingToIcon.Value]} />
			</Badge>

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
