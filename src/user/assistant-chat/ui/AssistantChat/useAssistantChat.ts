import { useRouter } from "@tanstack/react-router";
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

	return {
		status: "pending",
		messages: [] as MessageUi[],
		sendMessage(_: { text: string }) {
			//
		},
	};
};
