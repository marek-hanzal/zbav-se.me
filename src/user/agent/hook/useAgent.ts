import type { AgentInputItem } from "@openai/agents-core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import { createParser } from "eventsource-parser";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { genId } from "@/lib/common/gen-id";
import { AgentStreamItemsQuery } from "~/user/agent/query/AgentStreamItemsQuery";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import type { RunStreamEvent } from "~/user/agent/type/AgentEvent";

export namespace useAgent {
	export interface Variables {
		text: string;
	}

	export interface Props extends MarkSuspense.Props {
		//
	}

	export interface Result {
		submit(text: string): Promise<void>;
		cancel(): void;
		isBusy: boolean;
	}

	export type UseResult = ReturnType<typeof useAgent>;
}

export const useAgent = ({ _suspense }: useAgent.Props) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const liveQuery = withAgentLiveQuery.useSet();
	const setHistoryItems = withAgentStreamItemsQuery.useSet();

	const abortControllerRef = useRef<AbortController | null>(null);

	const link = useMemo(() => {
		return router.buildLocation({
			to: "/api/user/agent",
		});
	}, [
		router,
	]);

	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const mutation = useMutation<void, Error, useAgent.Variables>({
		async mutationFn({ text }) {
			const trimmed = text.trim();

			if (trimmed.length === 0) {
				return;
			}

			setHistoryItems((current) => {
				return [
					...(current ?? []),
					{
						id: genId(),
						role: "user",
						content: trimmed,
					},
				] satisfies AgentInputItem[];
			}, AgentStreamItemsQuery);

			liveQuery(() => []);

			abortControllerRef.current = new AbortController();
			const decoder = new TextDecoder();

			const parser = createParser({
				onEvent: (message) => {
					if (message.data.length === 0) {
						return;
					}

					liveQuery((prev) => [
						...(prev || []),
						JSON.parse(message.data) as RunStreamEvent,
					]);
				},
			});

			const response = await axios
				.create({
					adapter: "fetch",
				})
				.post<ReadableStream<Uint8Array>>(link.href, JSON.stringify(trimmed), {
					headers: {
						Accept: "text/event-stream",
						"Content-Type": "application/json",
					},
					signal: abortControllerRef.current.signal,
					responseType: "stream",
				});

			const reader = response.data.getReader();

			try {
				for (;;) {
					const { done, value } = await reader.read();

					if (done) {
						break;
					}

					if (!value) {
						continue;
					}

					parser.feed(
						decoder.decode(value, {
							stream: true,
						}),
					);
				}

				const rest = decoder.decode();

				if (rest.length > 0) {
					parser.feed(rest);
				}
			} finally {
				reader.releaseLock();
			}
		},
		onError(error) {
			console.error(error);
		},
		async onSettled() {
			abortControllerRef.current = null;
			await withAgentStreamItemsQuery.invalidate(queryClient);
			liveQuery(() => []);
		},
	});

	const submit = useCallback(
		async (text: string) => {
			if (mutation.isPending) {
				return;
			}

			try {
				await mutation.mutateAsync({
					text,
				});
			} catch (error) {
				console.error(error);
			}
		},
		[
			mutation,
		],
	);

	const cancel = useCallback(() => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = null;
	}, []);

	return {
		mutation,
		submit,
		cancel,
	} as const;
};
