import { withEntityQuery } from "@use-pico/client/query";
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
	async fetchFn(data) {
		return withApi(
			apiDraftFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiDraftCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return withApi(
			apiDraftCount({
				body: data,
			}),
		);
	},
	async createFn(data) {
		return withApi(
			apiDraftCreate({
				body: data,
			}),
		);
	},
	async deleteFn(data) {
		return withApi(
			apiDraftDelete({
				body: data,
			}),
		);
	},
	async patchFn(data) {
		return withApi(
			apiDraftPatch({
				body: data,
			}),
		);
	},
});
