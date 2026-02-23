import { withListingQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";
import { Hero } from "~/app/@buyer-user/listing/ui/Hero";

export namespace ListingItem {
	export interface Props {
		listingId: string;
		feedId: string;
		withScore: boolean;
	}
}

export const ListingItem: FC<ListingItem.Props> = ({ listingId, feedId, withScore }) => {
	const listingQuery = withListingQuery.useQuery(listingId);

	return (
		<Hero
			data-ui={"ListingListContainer-[ListingHeroContainer]"}
			listing={listingQuery.data}
			feedId={feedId}
			withScore={withScore}
			tools={[
				"destructive",
				"hero",
				"thumb",
			]}
		/>
	);
};
