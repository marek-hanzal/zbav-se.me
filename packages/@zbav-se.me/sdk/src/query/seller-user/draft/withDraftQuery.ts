import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiDraftCollection,
	apiDraftCount,
	apiDraftFetch,
	apiDraftPatch,
	type tDraft,
	type tDraftCountQuery,
	type tDraftPatch,
	type tDraftQuery,
} from "../../../api/seller-user";

export const withDraftQuery = withEntityQuery<
	tDraft,
	tDraftQuery,
	tDraftQuery,
	tDraftCountQuery,
	tDraftPatch
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
	async patch(data) {
		return withApi(
			apiDraftPatch({
				body: data,
			}),
		);
	},
});
