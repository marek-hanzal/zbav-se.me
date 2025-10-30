import { withMutation } from "@use-pico/client";
import { apiFeedCreate, type FeedCreate, type FeedDto } from "@zbav-se.me/sdk";

export const withFeedCreateMutation = withMutation<FeedCreate, FeedDto>({
	keys(variables) {
		return [
			"feed",
			"create",
			variables,
		];
	},
	async mutationFn(variables) {
		return apiFeedCreate(variables).then((res) => res.data);
	},
});
