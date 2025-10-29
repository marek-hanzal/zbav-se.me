import { useInfiniteQuery } from "@tanstack/react-query";
import { apiListingCollection } from "@zbav-se.me/sdk";

export namespace useListingInfiniteQuery {
	export interface Props {
		locationId?: string;
		size: number;
	}
}

export const useListingInfiniteQuery = ({
	locationId,
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
					params: locationId
						? {
								geo: {
									locationId,
									sort: "asc",
								},
							}
						: undefined,
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
