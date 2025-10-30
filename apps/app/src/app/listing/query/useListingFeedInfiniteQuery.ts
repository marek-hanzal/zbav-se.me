import { useInfiniteQuery } from "@tanstack/react-query";
import { apiListingFeedCollection } from "@zbav-se.me/sdk";

export namespace useListingFeedInfiniteQuery {
	export interface Props {
		feedId: string;
		size: number;
	}
}

export const useListingFeedInfiniteQuery = ({
	feedId,
	size,
}: useListingFeedInfiniteQuery.Props) => {
	return useInfiniteQuery({
		queryKey: [
			"listing",
			"feed",
			"infinite",
			{
				feedId,
				size,
			},
		],
		initialPageParam: 0,
		async queryFn({ pageParam, signal }) {
			return apiListingFeedCollection(
				{
					feedId,
					cursor: {
						page: pageParam,
						size,
					},
				},
				{
					signal,
				},
			).then((r) => r.data);
		},
		getNextPageParam: (lastPage, _pages, lastPageParam) => {
			return lastPage.more ? lastPageParam + 1 : undefined;
		},
	});
};
