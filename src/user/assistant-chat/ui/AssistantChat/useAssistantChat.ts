import type { AgentInputItem } from "@openai/agents-core";
import { useEffect, useMemo, useState } from "react";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
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
	const [messages, setMessages] = useState<AssistantChatMessageSchema.Type[]>(persistedMessages);

	const mutation = useMessageMutation({
		setMessages,
	});

	useEffect(() => {
		if (mutation.mutation.isPending) {
			return;
		}

		setMessages(persistedMessages);
	}, [
		mutation.mutation.isPending,
		persistedMessages,
	]);

	return {
		messages,
		mutation,
	};
};
