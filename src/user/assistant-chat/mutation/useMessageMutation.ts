import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { createEventSource } from "eventsource-client";
import { useCallback, useEffect, useRef } from "react";
import { genId } from "@/lib/common/gen-id";
import type { AssistantChatMessageSchema } from "~/user/assistant/schema/message/AssistantChatMessageSchema";
import { createAssistantChatMessage } from "~/user/assistant/service/createAssistantChatMessage";
import { getResponseError } from "~/user/assistant/service/getResponseError";
import { isAbortError } from "~/user/assistant/service/isAbortError";
import { reduceAssistantChatStreamEvent } from "~/user/assistant/service/reduceAssistantChatStreamEvent";

export namespace useMessageMutation {
	export interface Variables {
		text: string;
	}

	export interface Props {
		setPendingStatus(status: "submitted" | "streaming"): void;
		setMessages(
			updater: (
				messages: AssistantChatMessageSchema.Type[],
			) => AssistantChatMessageSchema.Type[],
		): void;
	}
}

export const useMessageMutation = ({ setPendingStatus, setMessages }: useMessageMutation.Props) => {
	const { buildLocation } = useRouter();
	const abortControllerRef = useRef<AbortController | null>(null);
	const assistantLocation = buildLocation({
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
			setPendingStatus("submitted");
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
				await new Promise<void>((resolve, reject) => {
					let requestError: Error | null = null;
					let isCompleted = false;
					let eventSource: ReturnType<typeof createEventSource> | null = null;

					const complete = () => {
						if (isCompleted) {
							return;
						}

						isCompleted = true;
						resolve();
					};
					const abort = () => {
						eventSource?.close();
						reject(new DOMException("The operation was aborted.", "AbortError"));
					};

					controller.signal.addEventListener("abort", abort, {
						once: true,
					});

					eventSource = createEventSource({
						url: assistantLocation.href,
						method: "POST",
						headers: {
							Accept: "text/event-stream",
							"Content-Type": "application/json",
						},
						body: JSON.stringify(trimmed),
						fetch: async (url, init) => {
							const response = await fetch(url, {
								...init,
								signal: AbortSignal.any([
									controller.signal,
									init?.signal as AbortSignal,
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
								requestError = new Error(
									"Assistant stream is missing response body",
								);

								throw requestError;
							}

							return response;
						},
						onMessage: (message) => {
							if (!message.data) {
								return;
							}

							setPendingStatus("streaming");

							const event = JSON.parse(message.data);

							setMessages((messages) => {
								const nextState = reduceAssistantChatStreamEvent({
									event,
									messages,
									status: "streaming",
								});

								return nextState.messages;
							});
						},
						onDisconnect: () => {
							eventSource?.close();

							if (requestError) {
								reject(requestError);
								return;
							}

							complete();
						},
						onScheduleReconnect: () => {
							if (!requestError) {
								return;
							}

							eventSource?.close();
						},
					});
				});
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
