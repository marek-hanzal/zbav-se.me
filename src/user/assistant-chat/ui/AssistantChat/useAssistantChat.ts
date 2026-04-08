import type { AgentInputItem } from "@openai/agents-core";
import { useRouter } from "@tanstack/react-router";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { genId } from "@/lib/common/gen-id";
import { Route as ApiAssistantRoute } from "~/@routes/api/assistant";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import { buildAssistantUrl } from "~/user/assistant/service/buildAssistantUrl";
import { createAssistantChatMessage } from "~/user/assistant/service/createAssistantChatMessage";
import { fromAgentInputItems } from "~/user/assistant/service/fromAgentInputItems";
import { getResponseError } from "~/user/assistant/service/getResponseError";
import { isAbortError } from "~/user/assistant/service/isAbortError";
import { reduceAssistantChatStreamEvent } from "~/user/assistant/service/reduceAssistantChatStreamEvent";
import { withAssistantChatQuery } from "~/user/assistant-chat/query/withAssistantChatQuery";

export namespace useAssistantChat {
	export type Status = "idle" | "submitted" | "streaming" | "error";
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
	const abortControllerRef = useRef<AbortController | null>(null);
	const [status, setStatus] = useState<useAssistantChat.Status>("idle");
	const [error, setError] = useState<string | null>(null);
	const persistedMessages = useMemo(() => {
		return fromAgentInputItems({
			items: assistantQuery.data.map((item) => item.payload as AgentInputItem),
		});
	}, [
		assistantQuery.data,
	]);
	const [messages, setMessages] = useState<AssistantChatMessageSchema.Type[]>(persistedMessages);

	useEffect(() => {
		if (status === "submitted" || status === "streaming") {
			return;
		}

		setMessages(persistedMessages);
	}, [
		persistedMessages,
		status,
	]);

	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const stop = useCallback(() => {
		abortControllerRef.current?.abort();
	}, []);

	const sendMessage = useCallback(
		async ({ text }: { text: string }) => {
			if (status === "submitted" || status === "streaming") {
				return;
			}

			const trimmed = text.trim();

			if (trimmed.length === 0) {
				return;
			}

			const userMessageId = genId();
			const assistantMessageId = genId();
			const controller = new AbortController();
			const assistantLocation = buildLocation({
				to: ApiAssistantRoute.to,
			});

			abortControllerRef.current = controller;
			setError(null);
			setStatus("submitted");
			setMessages((messages) => {
				return [
					...messages,
					{
						id: userMessageId,
						role: "user",
						parts: [
							{
								id: `${userMessageId}-text-0`,
								type: "text",
								text: trimmed,
							},
						],
					},
					createAssistantChatMessage({
						id: assistantMessageId,
						role: "assistant",
					}),
				];
			});

			try {
				const response = await fetch(
					buildAssistantUrl({
						href: assistantLocation.href,
						pathname: assistantLocation.pathname,
						search: assistantLocation.search,
						hash: assistantLocation.hash,
					}),
					{
						method: "POST",
						headers: {
							Accept: "text/event-stream",
							"Content-Type": "application/json",
						},
						body: JSON.stringify(trimmed),
						signal: controller.signal,
					},
				);

				if (!response.ok) {
					throw new Error(
						await getResponseError({
							response,
						}),
					);
				}

				if (!response.body) {
					throw new Error("Assistant stream is missing response body");
				}

				const stream = response.body
					.pipeThrough(new TextDecoderStream())
					.pipeThrough(new EventSourceParserStream());

				for await (const sseEvent of stream) {
					if (!sseEvent.data) {
						continue;
					}

					const event = JSON.parse(sseEvent.data);

					setMessages((messages) => {
						const nextState = reduceAssistantChatStreamEvent({
							event,
							messages,
							status,
						});

						setStatus(nextState.status);

						return nextState.messages;
					});
				}

				setStatus("idle");
			} catch (error) {
				if (
					isAbortError({
						error,
					})
				) {
					setStatus("idle");
				} else {
					setError(error instanceof Error ? error.message : "Assistant stream failed");
					setStatus("error");
				}
			} finally {
				abortControllerRef.current = null;
				void assistantQuery.refetch();
			}
		},
		[
			assistantQuery,
			buildLocation,
			status,
		],
	);

	return {
		status,
		error,
		messages,
		sendMessage,
		stop,
	};
};
