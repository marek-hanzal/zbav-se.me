import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiDraftCollection,
	apiDraftCount,
	apiDraftCreate,
	apiDraftDelete,
	apiDraftFetch,
	apiDraftPatch,
	type tDraft,
	type tDraftCountQuery,
	type tDraftCreate,
	type tDraftPatch,
	type tDraftQuery,
} from "../../../api/seller";

export const withDraftQuery = withEntityQuery<
	tDraft,
	tDraftQuery,
	tDraftQuery,
	tDraftCountQuery,
	tDraftPatch,
	tDraftCreate,
	tDraftQuery
>({
	keys: () => [
		"draft",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	fetchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiDraftFetch({
					body: request,
					headers,
				}),
			);
		},
	}),
	collectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiDraftCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
	countFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiDraftCount({
					body: request,
					headers,
				}),
			);
		},
	}),
	createFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiDraftCreate({
					body: request,
					headers,
				}),
			);
		},
	}),
	deleteFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiDraftDelete({
					body: request,
					headers,
				}),
			);
		},
	}),
	patchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiDraftPatch({
					body: request,
					headers,
				}),
			);
		},
	}),
	async patchCollectionFn(_data) {
		throw new Error("Draft collection patch is not supported.");
	},
});
