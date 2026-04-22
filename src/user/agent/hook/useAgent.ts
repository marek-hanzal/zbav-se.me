import type { RunStreamEvent } from "@openai/agents";
import type { AgentInputItem } from "@openai/agents-core";
import { useAsyncQueuer } from "@tanstack/react-pacer/async-queuer";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import { createParser } from "eventsource-parser";
import { type RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { genId } from "@/lib/common/gen-id";
import { useLogger } from "~/common/log/hook/useLogger";
import { AgentStreamItemsQuery } from "~/user/agent/query/AgentStreamItemsQuery";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import { withAgentUsageQuery } from "~/user/agent/query/withAgentUsageQuery";

export namespace useAgent {
	export interface Props extends MarkSuspense.Props {
		threadId: string;
	}

	export interface SubmitInput {
		input: AgentInputItem[];
	}

	export interface QueuerState {
		isPending: boolean;
		isQueueFull: boolean;
		queueSize: number;
		queueText: string | undefined;
	}

	export type Use = ReturnType<typeof useAgent>;
}

export const useAgent = ({ _suspense, threadId }: useAgent.Props) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const liveQuery = withAgentLiveQuery.useSet();
	const setHistoryItems = withAgentStreamItemsQuery.useSet();
	const usageQueryInvalidator = withAgentUsageQuery.useInvalidate();
	const logger = useLogger({
		name: [
			"hook",
			"useAgent",
		],
	});

	const abortControllerRef = useRef<AbortController | null>(null);

	const link = useMemo(() => {
		return router.buildLocation({
			to: "/api/agent/$threadId",
			params: {
				threadId,
			},
		});
	}, [
		router,
		threadId,
	]);

	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const appendHistoryItems = useCallback(
		(input: AgentInputItem[]) => {
			setHistoryItems((current) => {
				const ids = new Set((current ?? []).map((item) => item.id).filter(Boolean));

				return [
					...(current ?? []),
					...input.filter((item) => !item.id || !ids.has(item.id)),
				] satisfies AgentInputItem[];
			}, AgentStreamItemsQuery(threadId));
		},
		[
			setHistoryItems,
			threadId,
		],
	);

	const queuer = useAsyncQueuer<useAgent.SubmitInput, useAgent.QueuerState>(
		async ({ input }) => {
			appendHistoryItems(input);

			try {
				await submitAgentRun({
					abortControllerRef,
					input,
					link: link.href,
					liveQuery,
				});
			} finally {
				abortControllerRef.current = null;
				await withAgentStreamItemsQuery.invalidate(queryClient);
				liveQuery(() => []);
				await usageQueryInvalidator();
			}
		},
		{
			concurrency: 1,
			key: `agent-${threadId}`,
			maxSize: 5,
			throwOnError: false,
			onError(error) {
				logger.error("Agent queue item failed", {
					error: getErrorMessage(error),
					threadId,
				});
			},
		},
		(state) => ({
			isPending: state.isExecuting || state.activeItems.length > 0 || state.size > 0,
			isQueueFull: state.isFull,
			queueSize: state.size,
			queueText: getQueueText(state.items),
		}),
	);

	const submit = useCallback(
		async (input: AgentInputItem[]) => {
			queuer.addItem({
				input,
			});
		},
		[
			queuer,
		],
	);

	const clearQueue = useCallback(() => {
		queuer.clear();
	}, [
		queuer,
	]);

	const cancel = useCallback(() => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = null;
		queuer.abort();
	}, [
		queuer,
	]);

	return {
		threadId,
		isPending: queuer.state.isPending,
		isQueueFull: queuer.state.isQueueFull,
		queueSize: queuer.state.queueSize,
		queueText: queuer.state.queueText,
		submit,
		clearQueue,
		input: {
			text(text: string): AgentInputItem[] {
				return [
					{
						id: genId(),
						role: "user",
						content: text.trim(),
					},
				];
			},
			image(text: string, src: string[]): AgentInputItem[] {
				return [
					{
						id: genId(),
						role: "user",
						content: [
							...src.flatMap((url) => [
								{
									type: "input_image",
									image: url,
								} as const,
								{
									type: "input_text",
									text: url,
								} as const,
							]),
							{
								type: "input_text",
								text,
							},
						],
					},
				];
			},
		},
		cancel,
	} as const;
};

// =================================================================================================

namespace submitAgentRun {
	export interface Props {
		abortControllerRef: RefObject<AbortController | null>;
		input: AgentInputItem[];
		link: string;
		liveQuery: ReturnType<typeof withAgentLiveQuery.useSet>;
	}
}

async function submitAgentRun({
	abortControllerRef,
	input,
	link,
	liveQuery,
}: submitAgentRun.Props): Promise<void> {
	liveQuery(() => []);

	abortControllerRef.current = new AbortController();
	const decoder = new TextDecoder();

	const parser = createParser({
		onEvent: (message) => {
			if (message.data.length === 0) {
				return;
			}

			liveQuery((prev) => [
				...(prev ?? []),
				JSON.parse(message.data) as RunStreamEvent,
			]);
		},
	});

	const response = await axios
		.create({
			adapter: "fetch",
		})
		.post<ReadableStream<Uint8Array>>(link, JSON.stringify(input), {
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
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

function getQueueText(queue: useAgent.SubmitInput[]): string | undefined {
	const [item] = queue;

	if (!item) {
		return undefined;
	}

	const text = item.input.map(getInputText).filter(Boolean).join(" ");
	const suffix = queue.length > 1 ? ` (+${queue.length - 1})` : "";

	return `${text}${suffix}`;
}

function getInputText(item: AgentInputItem): string {
	if ("role" in item && item.role === "user") {
		if (typeof item.content === "string") {
			return item.content;
		}

		return item.content
			.filter((content) => content.type === "input_text")
			.map((content) => content.text)
			.join(" ");
	}

	return "";
}
