import { withEntityQuery } from "@/lib/client/query";
import { assistantChatCollectionFn } from "~/user/assistant-chat/server/fn/assistantChatCollectionFn";
import { assistantChatCountFn } from "~/user/assistant-chat/server/fn/assistantChatCountFn";
import { assistantChatFetchFn } from "~/user/assistant-chat/server/fn/assistantChatFetchFn";
import type { AssistantChatQuerySchema } from "~/user/assistant-chat/server/schema/AssistantChatQuerySchema";
import type { AssistantChatSchema } from "~/user/assistant-chat/server/schema/AssistantChatSchema";

export const withAssistantChatQuery = withEntityQuery<
	AssistantChatSchema.Type,
	AssistantChatQuerySchema.Type,
	AssistantChatQuerySchema.Type,
	AssistantChatQuerySchema.Type,
	never,
	never,
	AssistantChatQuerySchema.Type,
	never
>({
	keys: () => [
		"assistant_chat",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return assistantChatFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return assistantChatCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return assistantChatCountFn({
			data,
		});
	},
	async createFn(_data) {
		throw new Error("Assistant create is not supported.");
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
