import { withMutation } from "@use-pico/client";
import { apiFeedDelete, type tFeedDto, type tFeedQuery } from "@zbav-se.me/sdk";
import { withFeedCollectionQuery } from "~/app/feed/query/withFeedCollectionQuery";

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
		withFeedCollectionQuery,
	],
});
