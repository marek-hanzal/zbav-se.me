import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { useCallback, useEffect, useRef } from "react";
import { genId } from "@/lib/common/gen-id";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import { getResponseError } from "~/user/assistant/service/getResponseError";
import { reduceAssistantChatStreamEvent } from "~/user/assistant/service/reduceAssistantChatStreamEvent";

export namespace useMessageMutation {
	export interface Variables {
		text: string;
	}

	export interface Props {
		setMessages(
			updater: (
				messages: AssistantChatMessageSchema.Type[],
			) => AssistantChatMessageSchema.Type[],
		): void;
	}
}

export const useMessageMutation = ({ setMessages }: useMessageMutation.Props) => {
	const { buildLocation } = useRouter();
	const abortControllerRef = useRef<AbortController | null>(null);
	const link = buildLocation({
		to: "/api/assistant",
	});

	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const stop = useCallback(() => {
		abortControllerRef.current?.abort();
	}, []);

	const mutation = useMutation<void, Error, useMessageMutation.Variables>({
		async mutationFn({ text }) {
			const trimmed = text.trim();

			if (trimmed.length === 0) {
				return;
			}

			const userMessageId = genId();
			const assistantMessageId = genId();
			const controller = new AbortController();

			abortControllerRef.current = controller;
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
					{
						id: assistantMessageId,
						role: "assistant",
						parts: [],
					} satisfies AssistantChatMessageSchema.Type,
				];
			});

			try {
				const response = await fetch(link.href, {
					method: "POST",
					headers: {
						Accept: "text/event-stream",
						"Content-Type": "application/json",
					},
					body: JSON.stringify(trimmed),
					signal: controller.signal,
				});

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

				const reader = stream.getReader();

				for (;;) {
					const { done, value } = await reader.read();

					if (done) {
						break;
					}

					if (!value.data) {
						continue;
					}

					const event = JSON.parse(value.data);

					setMessages((messages) => {
						const nextState = reduceAssistantChatStreamEvent({
							event,
							messages,
							status: "streaming",
						});

						return nextState.messages;
					});
				}
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") {
					return;
				}

				throw error;
			}
		},
		onSettled() {
			abortControllerRef.current = null;
		},
	});

	return {
		mutation,
		stop,
	};
};
