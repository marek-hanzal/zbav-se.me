import { useChat } from "@ai-sdk/react";
import { useRouter } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import type { MessageUi } from "~/user/assistant/MessageUi";
import { withAssistantChatQuery } from "~/user/assistant-chat/query/withAssistantChatQuery";

export namespace useAssistantChat {
	export type UseResult = ReturnType<typeof useAssistantChat>;
}

export const useAssistantChat = () => {
	const { buildLocation } = useRouter();
	const assistantQuery = withAssistantChatQuery.useCollectionQuery({
		sort: [
			{
				field: "sort",
				order: "asc",
			},
		],
	});

	return useChat({
		transport: new DefaultChatTransport({
			api: buildLocation({
				to: "/api/assistant",
			}).href,
		}),
		messages: assistantQuery.data.map((item) => {
			return item.payload as MessageUi;
		}),
	});
};
