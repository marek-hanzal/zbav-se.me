import { withInfiniteQuery } from "@use-pico/client/query";
import { apiListingCollection } from "../api/session/sdk.gen";
import type { tLatLon } from "../api/session/types.gen";

export namespace withListingInfiniteQuery {
	export interface Props {
		lonLan?: tLatLon | null;
		size: number;
	}
}

export const withListingInfiniteQuery = ({
	lonLan,
	size,
}: withListingInfiniteQuery.Props) => {
	return withInfiniteQuery({
		keys(data) {
			return [
				"listing",
				"infinite",
				size,
				data,
			];
		},
		async queryFn({ page, signal }) {
			return apiListingCollection({
				throwOnError: true,
				body: {
					cursor: {
						page,
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
	});
};
