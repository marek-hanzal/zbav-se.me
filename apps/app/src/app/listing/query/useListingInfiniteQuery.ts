import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import type { tLatLon } from "@zbav-se.me/sdk/api/session";
import {
	apiListingCollection,
	type tListingCollection,
} from "@zbav-se.me/sdk/api/session";

export namespace useListingInfiniteQuery {
	export interface Props {
		lonLan?: tLatLon | null;
		size: number;
	}
}

export const useListingInfiniteQuery = ({
	lonLan,
	size,
}: useListingInfiniteQuery.Props) => {
	const queryKey = [
		"listing",
		"infinite",
		{
			size,
		},
	] as const;

	return useInfiniteQuery<
		tListingCollection,
		Error,
		InfiniteData<tListingCollection>,
		typeof queryKey,
		number
	>({
		queryKey,
		initialPageParam: 0,
		async queryFn({ pageParam, signal }) {
			return apiListingCollection({
				throwOnError: true,
				body: {
					cursor: {
						page: pageParam,
						size,
					},
					sort: [
						{
							value: "geo",
							sort: "asc",
						},
						{
							value: "createdAt",
							sort: "desc",
						},
					],
					meta: lonLan
						? {
								latLon: lonLan,
							}
						: undefined,
				},
				signal,
			}).then((res) => res.data);
		},
		getNextPageParam: (lastPage, _pages, lastPageParam) => {
			return lastPage.more ? lastPageParam + 1 : undefined;
		},
	});
};
