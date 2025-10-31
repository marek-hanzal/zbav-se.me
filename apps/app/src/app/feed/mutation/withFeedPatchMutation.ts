import { withMutation } from "@use-pico/client";
import { apiFeedPatch, type tFeedDto, type tFeedPatch } from "@zbav-se.me/sdk";
import { withFeedCollectionQuery } from "~/app/feed/query/withFeedCollectionQuery";

export const withFeedPatchMutation = withMutation<tFeedPatch, tFeedDto>({
	keys(variables) {
		return [
			"feed",
			"patch",
			variables,
		];
	},
	async mutationFn(body) {
		return apiFeedPatch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
	invalidate: [
		withFeedCollectionQuery,
	],
});
