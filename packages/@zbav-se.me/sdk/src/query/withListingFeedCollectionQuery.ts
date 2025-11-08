import { withQuery } from "@use-pico/client/query";
import type { tListingFilter } from "../api/session";
import { apiListingFeedCollection } from "../api/session/sdk.gen";

export namespace withListingFeedCollectionQuery {
	export interface Props {
		feedId: string;
		size: number;
		where?: tListingFilter;
	}
}

export const withListingFeedCollectionQuery = ({
	feedId,
	size,
	where,
}: withListingFeedCollectionQuery.Props) => {
	return withQuery({
		keys(data) {
			return [
				"listing",
				"feed",
				"collection",
				{
					feedId,
					size,
				},
				data,
			];
		},
		async queryFn() {
			return apiListingFeedCollection({
				body: {
					feedId,
					cursor: {
						page: 0,
						size,
					},
					where,
				},
				throwOnError: true,
			}).then((res) => res.data);
		},
	});
};
