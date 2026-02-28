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
} from "../../../api/seller-user";

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
	async fetch(data) {
		return withApi(
			apiDraftFetch({
				body: data,
			}),
		);
	},
	async collection(data) {
		return withApi(
			apiDraftCollection({
				body: data,
			}),
		);
	},
	async count(data) {
		return withApi(
			apiDraftCount({
				body: data,
			}),
		);
	},
	async create(data) {
		return withApi(
			apiDraftCreate({
				body: data,
			}),
		);
	},
	async delete(data) {
		return withApi(
			apiDraftDelete({
				body: data,
			}),
		);
	},
	async patch(data) {
		return withApi(
			apiDraftPatch({
				body: data,
			}),
		);
	},
});
