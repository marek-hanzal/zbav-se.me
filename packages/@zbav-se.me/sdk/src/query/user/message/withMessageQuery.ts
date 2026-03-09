import { withEntityQuery } from "@use-pico/client/query";
import { withApi } from "@use-pico/common/api";
import {
	apiMessageCollection,
	apiMessageCount,
	apiMessageCreate,
	apiMessageFetch,
	type tMessage,
	type tMessageCountQuery,
	type tMessageCreate,
	type tMessageQuery,
} from "../../../api/user";

export const withMessageQuery = withEntityQuery<
	tMessage,
	tMessageQuery,
	tMessageQuery,
	tMessageCountQuery,
	never,
	tMessageCreate,
	never
>({
	keys: () => [
		"message",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return withApi(
			apiMessageFetch({
				body: data,
			}),
		);
	},
	async collectionFn(data) {
		return withApi(
			apiMessageCollection({
				body: data,
			}),
		);
	},
	async countFn(data) {
		return withApi(
			apiMessageCount({
				body: data,
			}),
		);
	},
	async createFn(data) {
		return withApi(
			apiMessageCreate({
				body: data,
			}),
		);
	},
	async patchFn(_data) {
		throw new Error("Message patch is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Message delete is not supported.");
	},
});
