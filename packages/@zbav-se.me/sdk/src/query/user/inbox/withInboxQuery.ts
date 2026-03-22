import { withEntityQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiInboxCollection,
	apiInboxCount,
	apiInboxFetch,
	apiInboxPatch,
	apiInboxPatchCollection,
	type tInbox,
	type tInboxCountQuery,
	type tInboxPatch,
	type tInboxPatchCollection,
	type tInboxQuery,
} from "../../../api/user";

export const withInboxQuery = withEntityQuery<
	tInbox,
	tInboxQuery,
	tInboxQuery,
	tInboxCountQuery,
	tInboxPatch,
	never,
	never,
	tInboxPatchCollection
>({
	keys: () => [
		"inbox",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	fetchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiInboxFetch({
					body: request,
					headers,
				}),
			);
		},
	}),
	collectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiInboxCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
	countFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiInboxCount({
					body: request,
					headers,
				}),
			);
		},
	}),
	async createFn(_data) {
		throw new Error("Inbox create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Inbox delete is not supported.");
	},
	patchFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiInboxPatch({
					body: request,
					headers,
				}),
			);
		},
	}),
	patchCollectionFn: isomorphicFn({
		requestFn(request, headers) {
			return withApi(
				apiInboxPatchCollection({
					body: request,
					headers,
				}),
			);
		},
	}),
});
