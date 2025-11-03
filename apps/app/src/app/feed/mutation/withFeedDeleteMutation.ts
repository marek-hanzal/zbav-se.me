import { withMutation } from "@use-pico/client/mutation";
import { apiFeedDelete, type tFeedDto, type tFeedQuery } from "@zbav-se.me/sdk";
import { withFeedCollectionQuery } from "~/app/feed/query/withFeedCollectionQuery";
import { withFeedCountQuery } from "~/app/feed/query/withFeedCountQuery";

export const withFeedDeleteMutation = withMutation<tFeedQuery, tFeedDto>({
	keys(variables) {
		return [
			"feed",
			"delete",
			variables,
		];
	},
	async mutationFn(body) {
		return apiFeedDelete({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
	invalidate: [
		withFeedCountQuery,
		withFeedCollectionQuery,
	],
});
