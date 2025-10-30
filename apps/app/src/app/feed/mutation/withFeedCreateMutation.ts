import { withMutation } from "@use-pico/client";
import {
	apiFeedCreate,
	type tFeedCreate,
	type tFeedDto,
} from "@zbav-se.me/sdk";
import { withFeedCollectionQuery } from "~/app/feed/query/withFeedCollectionQuery";

export const withFeedCreateMutation = withMutation<tFeedCreate, tFeedDto>({
	keys(variables) {
		return [
			"feed",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return apiFeedCreate({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
	invalidate: [
		withFeedCollectionQuery,
	],
});
