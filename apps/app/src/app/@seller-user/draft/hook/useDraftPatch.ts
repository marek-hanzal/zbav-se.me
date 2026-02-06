import type { tDraft, tDraftPatchData } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { useCallback } from "react";

export namespace useDraftPatch {
	/**
	 * Payload for draft patch (only the "patch" part; query.where is filled by the hook).
	 */
	export type Payload = tDraftPatchData;

	export interface Params {
		draft: tDraft;
		onSettled?(): void;
	}
}

/**
 * Encapsulates draft patch mutation + cache update (fetch query set).
 * Same pattern as useFeedPatch; patches build the payload and call patch(payload).
 */
export function useDraftPatch({ draft, onSettled }: useDraftPatch.Params) {
	const setDraft = withDraftFetchQuery.useSet();
	const mutation = withDraftPatchMutation.useMutation({
		onSuccess(updated) {
			setDraft(() => updated, {
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
		(payload: useDraftPatch.Payload) => {
			mutation.mutate({
				patch: payload,
				query: {
					where: {
						id: draft.id,
					},
				},
			});
		},
		[
			draft.id,
			mutation,
		],
	);

	return {
		patch,
		isPending: mutation.isPending,
	} as const;
}
