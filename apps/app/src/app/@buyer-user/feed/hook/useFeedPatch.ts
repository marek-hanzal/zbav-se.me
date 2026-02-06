import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { useCallback } from "react";

export namespace useFeedPatch {
	/**
	 * Payload for feed patch (only the "patch" part; query.where is filled by the hook).
	 * Ensures mutation response (tFeed) is what the fetch query cache expects.
	 */
	export type Payload = NonNullable<tFeedPatch["patch"]>;

	export interface Params {
		feed: tFeed;
		onSettled?(): void;
	}
}

/**
 * Encapsulates feed patch mutation + cache invalidation (fetch query set).
 * Typed so that the mutation response (tFeed) is written to the same query cache.
 * Patches only need to build the patch payload and call mutatePatch(payload).
 */
export function useFeedPatch({ feed, onSettled }: useFeedPatch.Params) {
	const setFeed = withFeedFetchQuery.useSet();
	const mutation = withFeedPatchMutation.useMutation({
		onSuccess(updated) {
			setFeed(() => updated, {
				where: {
					id: updated.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

	const patch = useCallback(
		(patch: useFeedPatch.Payload) => {
			mutation.mutate({
				patch,
				query: {
					where: {
						id: feed.id,
					},
				},
			});
		},
		[
			feed.id,
			mutation,
		],
	);

	return {
		patch,
		isPending: mutation.isPending,
	} as const;
}
