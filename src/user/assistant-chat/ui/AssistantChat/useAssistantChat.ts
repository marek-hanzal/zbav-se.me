import type { AgentInputItem } from "@openai/agents-core";
import { useMemo } from "react";
import { fromAgentInputItems } from "~/user/assistant/service/fromAgentInputItems";
import { useMessageMutation } from "~/user/assistant-chat/mutation/useMessageMutation";
import { withAssistantChatQuery } from "~/user/assistant-chat/query/withAssistantChatQuery";

export namespace useAssistantChat {
	export type UseResult = ReturnType<typeof useAssistantChat>;
}

export const useAssistantChat = () => {
	const assistantQuery = withAssistantChatQuery.useCollectionQuery({
		sort: [
			{
				field: "sort",
				order: "asc",
			},
		],
	});
	const persistedMessages = useMemo(() => {
		return fromAgentInputItems({
			items: assistantQuery.data.map((item) => item.payload as AgentInputItem),
		});
	}, [
		assistantQuery.data,
	]);

	const mutation = useMessageMutation({
		persistedMessages,
	});

	return {
		messages: mutation.messages,
		mutation,
	};
};
