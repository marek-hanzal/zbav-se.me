import type { AgentInputItem } from "@openai/agents-core";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import { fromAgentInputItems } from "~/user/assistant/service/fromAgentInputItems";
import { useMessageMutation } from "~/user/assistant-chat/mutation/useMessageMutation";
import { withAssistantChatQuery } from "~/user/assistant-chat/query/withAssistantChatQuery";

export namespace useAssistantChat {
	export type Status = "idle" | "submitted" | "streaming" | "error";
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
	const [pendingStatus, setPendingStatus] = useState<"submitted" | "streaming">("submitted");
	const persistedMessages = useMemo(() => {
		return fromAgentInputItems({
			items: assistantQuery.data.map((item) => item.payload as AgentInputItem),
		});
	}, [
		assistantQuery.data,
	]);
	const [messages, setMessages] = useState<AssistantChatMessageSchema.Type[]>(persistedMessages);

	const messageMutation = useMessageMutation({
		setPendingStatus,
		setMessages,
	});

	const status: useAssistantChat.Status = messageMutation.isError
		? "error"
		: messageMutation.isPending
			? pendingStatus
			: "idle";
	const error = messageMutation.error?.message ?? null;

	useEffect(() => {
		if (status === "submitted" || status === "streaming") {
			return;
		}

		setMessages(persistedMessages);
	}, [
		persistedMessages,
		status,
	]);

	const sendMessage = useCallback(
		async ({ text }: { text: string }) => {
			if (status === "submitted" || status === "streaming") {
				return;
			}

			await messageMutation.mutateAsync({
				text,
			});
		},
		[
			messageMutation,
			status,
		],
	);

	return {
		status,
		error,
		messages,
		sendMessage,
		stop: messageMutation.stop,
	};
};
