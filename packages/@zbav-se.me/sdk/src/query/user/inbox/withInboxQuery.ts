import { createIsomorphicFn } from "@tanstack/react-start";
import { withEntityQuery } from "@use-pico/client/query";
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

const countFn = createIsomorphicFn()
	.client(async (data: tInboxCountQuery) => {
		return withApi(
			apiInboxCount({
				body: data,
			}),
		);
	})
	.server(async (data: tInboxCountQuery) => {
		const { getRequestHeaders } = await import("@tanstack/react-start/server");
		const cookie = getRequestHeaders().get("cookie");

		return withApi(
			apiInboxCount({
				body: data,
				headers: cookie
					? {
							Cookie: cookie,
						}
					: undefined,
			}),
		);
	});

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
	async fetchFn(data) {
		return withApi(
			apiInboxFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiInboxCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return countFn(data);
	},
	async createFn(_data) {
		throw new Error("Inbox create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Inbox delete is not supported.");
	},
	async patchFn(data) {
		return withApi(
			apiInboxPatch({
				body: data,
			}),
		);
	},
	async patchCollectionFn(data) {
		return withApi(
			apiInboxPatchCollection({
				body: data,
			}),
		);
	},
});
