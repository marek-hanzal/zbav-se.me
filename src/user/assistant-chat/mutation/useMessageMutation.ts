import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createEventSource } from "eventsource-client";
import { useCallback, useEffect, useRef } from "react";
import { genId } from "@/lib/common/gen-id";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import { getResponseError } from "~/user/assistant/service/getResponseError";
import { isAbortError } from "~/user/assistant/service/isAbortError";
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
				let requestError: Error | null = null;
				const eventSource = createEventSource({
					url: link.href,
					method: "POST",
					headers: {
						Accept: "text/event-stream",
						"Content-Type": "application/json",
					},
					body: JSON.stringify(trimmed),
					async fetch(url, init) {
						const response = await fetch(url, {
							...init,
							signal: AbortSignal.any([
								controller.signal,
								init?.signal,
							]),
						});

						if (!response.ok) {
							requestError = new Error(
								await getResponseError({
									response,
								}),
							);

							throw requestError;
						}

						if (!response.body) {
							requestError = new Error("Assistant stream is missing response body");

							throw requestError;
						}

						return response;
					},
					onDisconnect() {
						eventSource.close();
					},
					onScheduleReconnect() {
						eventSource.close();
					},
				});

				const abort = () => {
					eventSource.close();
				};

				controller.signal.addEventListener("abort", abort, {
					once: true,
				});

				try {
					for await (const message of eventSource) {
						if (!message.data) {
							continue;
						}

						const event = JSON.parse(message.data);

						setMessages((messages) => {
							const nextState = reduceAssistantChatStreamEvent({
								event,
								messages,
								status: "streaming",
							});

							return nextState.messages;
						});
					}
				} finally {
					controller.signal.removeEventListener("abort", abort);
					eventSource.close();
				}

				if (requestError) {
					throw requestError;
				}
			} catch (error) {
				if (
					isAbortError({
						error,
					})
				) {
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
		...mutation,
		stop,
	};
};
