import { useInfiniteQuery } from "@tanstack/react-query";
import { apiListingCollection } from "@zbav-se.me/sdk";

export const useListingInfiniteQuery = () => {
	const size = 3;

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
					sort: [
						{
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
