import type { MarkSuspense } from "@use-pico/client/type";
import type { tListing, tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import type { FC, ReactNode } from "react";

export namespace ListingFetch {
	export interface Props extends MarkSuspense.Props {
		query: tListingQuery;
		children(listing: tListing): ReactNode;
	}
}

export const ListingFetch: FC<ListingFetch.Props> = ({ _suspense, query, children }) => {
	const listingQuery = withListingFetchQuery.useSuspenseQuery(query);

	return children(listingQuery.data);
};
