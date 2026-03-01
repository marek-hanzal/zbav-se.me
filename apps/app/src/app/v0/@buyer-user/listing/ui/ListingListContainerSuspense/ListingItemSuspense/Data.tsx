import { withListingQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";
import { Hero } from "~/app/v0/@buyer-user/listing/ui/Hero";

export namespace Data {
	export interface Props {
		listingId: string;
		feedId: string;
		withScore: boolean;
	}
}

export const Data: FC<Data.Props> = ({ listingId, feedId, withScore }) => {
	const listingQuery = withListingQuery.useFetchQuery(listingId);

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
