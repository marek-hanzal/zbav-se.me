import { withEntityQuery } from "@/lib/client/query";
import { assistantCollectionFn } from "~/user/assistant/server/fn/assistantCollectionFn";
import { assistantCountFn } from "~/user/assistant/server/fn/assistantCountFn";
import { assistantCreateFn } from "~/user/assistant/server/fn/assistantCreateFn";
import { assistantFetchFn } from "~/user/assistant/server/fn/assistantFetchFn";
import type { AssistantCreateSchema } from "~/user/assistant/server/schema/AssistantCreateSchema";
import type { AssistantQuerySchema } from "~/user/assistant/server/schema/AssistantQuerySchema";
import type { AssistantSchema } from "~/user/assistant/server/schema/AssistantSchema";

export const withAssistantQuery = withEntityQuery<
	AssistantSchema.Type,
	AssistantQuerySchema.Type,
	AssistantQuerySchema.Type,
	AssistantQuerySchema.Type,
	never,
	AssistantCreateSchema.Type,
	AssistantQuerySchema.Type,
	never
>({
	keys: () => [
		"assistant",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return assistantFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return assistantCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return assistantCountFn({
			data,
		});
	},
	async createFn(data) {
		return assistantCreateFn({
			data,
		});
	},
	async deleteFn(_data) {
		throw new Error("Assistant delete is not supported.");
	},
	async patchFn(_data) {
		throw new Error("Assistant patch is not supported.");
	},
	async patchCollectionFn(_data) {
		throw new Error("Assistant collection patch is not supported.");
	},
});
