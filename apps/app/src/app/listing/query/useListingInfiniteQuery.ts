import { useInfiniteQuery } from "@tanstack/react-query";
import type { LonLanSchema } from "@zbav-se.me/common";
import { apiListingCollection } from "@zbav-se.me/sdk";

export namespace useListingInfiniteQuery {
	export interface Props {
		lonLan?: LonLanSchema.Type | null;
		size: number;
	}
}

export const useListingInfiniteQuery = ({
	lonLan,
	size,
}: useListingInfiniteQuery.Props) => {
	return useInfiniteQuery({
		queryKey: [
			"listing",
			"infinite",
			{
				size,
			},
		],
		initialPageParam: 0,
		async queryFn({ pageParam, signal }) {
			return apiListingCollection(
				{
					cursor: {
						page: pageParam,
						size,
					},
					sort: lonLan
						? [
								{
									type: "geo",
									value: "geo",
									sort: "asc",
									...lonLan,
								},
								{
									type: "listing",
									value: "createdAt",
									sort: "desc",
								},
							]
						: [
								{
									type: "listing",
									value: "createdAt",
									sort: "desc",
								},
							],
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
