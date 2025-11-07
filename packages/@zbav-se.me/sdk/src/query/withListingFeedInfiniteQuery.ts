import { withInfiniteQuery } from "@use-pico/client/query";
import type { tListing, tListingCollection } from "../api/session";
import { apiListingFeedCollection } from "../api/session/sdk.gen";

export namespace withListingFeedInfiniteQuery {
	export interface Props {
		feedId: string;
		size: number;
	}
}

export const withListingFeedInfiniteQuery = ({
	feedId,
	size,
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
				},
				throwOnError: true,
				signal,
			}).then((res) => res.data);
		},
	});
};
