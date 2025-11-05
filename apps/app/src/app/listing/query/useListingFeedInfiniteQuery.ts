import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import {
	apiListingFeedCollection,
	type apiListingFeedCollectionError,
	type tListingCollection,
} from "@zbav-se.me/sdk/api/session";
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
	const queryKey = [
		"listing",
		"feed",
		"infinite",
		{
			feedId,
			size,
		},
	] as const;

	return useInfiniteQuery<
		tListingCollection,
		apiListingFeedCollectionError,
		InfiniteData<tListingCollection>,
		typeof queryKey,
		number
	>({
		queryKey,
		initialPageParam: 0,
		async queryFn({ pageParam, signal }) {
			return apiListingFeedCollection({
				body: {
					feedId,
					cursor: {
						page: pageParam,
						size,
					},
				},
				throwOnError: true,
				signal,
			}).then((r) => r.data);
		},
		getNextPageParam: (lastPage, _pages, lastPageParam) => {
			return lastPage.more ? lastPageParam + 1 : undefined;
		},
	});
};
