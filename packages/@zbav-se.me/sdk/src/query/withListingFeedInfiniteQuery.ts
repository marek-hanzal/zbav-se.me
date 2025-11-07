import { withInfiniteQuery } from "@use-pico/client/query";
import type { tListing, tListingCollection, tListingFilter } from "../api/session";
import { apiListingFeedCollection } from "../api/session/sdk.gen";

export namespace withListingFeedInfiniteQuery {
	export interface Props {
		feedId: string;
		size: number;
		where?: tListingFilter;
	}
}

export const withListingFeedInfiniteQuery = ({
	feedId,
	size,
	where,
}: withListingFeedInfiniteQuery.Props) => {
	return withInfiniteQuery<unknown, tListing, tListingCollection>({
		keys(data) {
			return [
				"listing",
				"feed",
				"infinite",
				{
					feedId,
					size,
				},
				data,
			];
		},
		async queryFn({ page, signal }) {
			return apiListingFeedCollection({
				body: {
					feedId,
					cursor: {
						page,
						size,
					},
					where,
				},
				throwOnError: true,
				signal,
			}).then((res) => res.data);
		},
	});
};
