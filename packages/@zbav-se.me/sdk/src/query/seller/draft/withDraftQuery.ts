import { createIsomorphicFn } from "@tanstack/react-start";
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

const collectionFn = createIsomorphicFn()
	.client(async (data: tDraftQuery) => {
		return withApi(
			apiDraftCollection({
				body: data,
			}),
		);
	})
	.server(async (data: tDraftQuery) => {
		const { getRequestHeaders } = await import("@tanstack/react-start/server");

		return withApi(
			apiDraftCollection({
				body: data,
				headers: {
					Cookie: getRequestHeaders().get("cookie"),
				},
			}),
		);
	});

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
		return collectionFn(data);
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
	async patchCollectionFn(_data) {
		throw new Error("Draft collection patch is not supported.");
	},
});
