import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiInboxCollection,
	apiInboxCount,
	apiInboxFetch,
	apiInboxPatch,
	type tInbox,
	type tInboxCountQuery,
	type tInboxPatch,
	type tInboxQuery,
} from "../../../api/user";

export const withInboxQuery = withEntityQuery<
	tInbox,
	tInboxQuery,
	tInboxQuery,
	tInboxCountQuery,
	tInboxPatch,
	never,
	never
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
		return withApi(
			apiInboxCount({
				body: data,
			}),
		);
	},
	async createFn(_data) {
		throw new Error("Inbox create is not supported by this query wrapper.");
	},
	async deleteFn(_data) {
		throw new Error("Inbox delete is not supported by this query wrapper.");
	},
	async patchFn(data) {
		return withApi(
			apiInboxPatch({
				body: data,
			}),
		);
	},
});
