import type { RunStreamEvent } from "@openai/agents";
import type { AgentInputItem } from "@openai/agents-core";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import { createParser } from "eventsource-parser";
import { type FC, type PropsWithChildren, useCallback, useRef, useState } from "react";
import { useLogger } from "~/common/log/hook/useLogger";
import { AgentStreamItemsQuery } from "~/user/agent/query/AgentStreamItemsQuery";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import { withAgentUsageQuery } from "~/user/agent/query/withAgentUsageQuery";
import { AgentRuntimeContext } from "./AgentRuntimeContext";

export namespace AgentRuntimeProvider {
	export interface Props extends PropsWithChildren {
		//
	}

	export type ThreadStateUpdater = (
		state: AgentRuntimeContext.ThreadState,
	) => AgentRuntimeContext.ThreadState;
}

const emptyThreadState = (): AgentRuntimeContext.ThreadState => ({
	isRunning: false,
	queue: [],
});

const maxQueueSize = 5;

export const AgentRuntimeProvider: FC<AgentRuntimeProvider.Props> = ({ children }) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const liveQuery = withAgentLiveQuery.useSet();
	const setHistoryItems = withAgentStreamItemsQuery.useSet();
	const logger = useLogger({
		name: [
			"runtime",
			"AgentRuntimeProvider",
		],
	});
	const abortControllersRef = useRef(new Map<string, AbortController>());
	const threadStatesRef = useRef(new Map<string, AgentRuntimeContext.ThreadState>());
	const [, setStateVersion] = useState(0);

	const bumpStateVersion = useCallback(() => {
		setStateVersion((version) => version + 1);
	}, []);

	const getThreadState = useCallback((threadId: string) => {
		return threadStatesRef.current.get(threadId) ?? emptyThreadState();
	}, []);

	const setThreadState = useCallback(
		(threadId: string, updater: AgentRuntimeProvider.ThreadStateUpdater) => {
			const next = updater(getThreadState(threadId));
			threadStatesRef.current.set(threadId, next);
			bumpStateVersion();
		},
		[
			bumpStateVersion,
			getThreadState,
		],
	);

	const appendHistoryItems = useCallback(
		(threadId: string, input: AgentInputItem[]) => {
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
		],
	);

	const executeRun = useCallback(
		async (threadId: string, input: AgentInputItem[]) => {
			appendHistoryItems(threadId, input);

			const abortController = new AbortController();
			abortControllersRef.current.set(threadId, abortController);

			const link = router.buildLocation({
				to: "/api/agent/$threadId",
				params: {
					threadId,
				},
			});

			try {
				await submitAgentRun({
					input,
					link: link.href,
					liveQuery,
					signal: abortController.signal,
					threadId,
				});
			} finally {
				abortControllersRef.current.delete(threadId);
				await withAgentStreamItemsQuery.invalidate(
					queryClient,
					AgentStreamItemsQuery(threadId),
				);
				liveQuery(() => [], {
					threadId,
				});
				await withAgentUsageQuery.invalidate(queryClient);
			}
		},
		[
			appendHistoryItems,
			liveQuery,
			queryClient,
			router,
		],
	);

	const runNext = useCallback(
		(threadId: string) => {
			const state = getThreadState(threadId);
			const [next, ...queue] = state.queue;

			if (state.isRunning || !next) {
				return;
			}

			setThreadState(threadId, () => ({
				isRunning: true,
				queue,
			}));

			void executeRun(threadId, next.input)
				.catch((error) => {
					logger.error("Agent queue item failed", {
						error: getErrorMessage(error),
						threadId,
					});
				})
				.finally(() => {
					setThreadState(threadId, (current) => ({
						...current,
						isRunning: false,
					}));
					runNext(threadId);
				});
		},
		[
			executeRun,
			getThreadState,
			logger,
			setThreadState,
		],
	);

	const submit = useCallback(
		(threadId: string, input: AgentInputItem[]) => {
			const state = getThreadState(threadId);

			if (state.queue.length >= maxQueueSize) {
				return;
			}

			setThreadState(threadId, (current) => ({
				...current,
				queue: [
					...current.queue,
					{
						input,
					},
				],
			}));
			runNext(threadId);
		},
		[
			getThreadState,
			runNext,
			setThreadState,
		],
	);

	const clearQueue = useCallback(
		(threadId: string) => {
			setThreadState(threadId, (current) => ({
				...current,
				queue: [],
			}));
		},
		[
			setThreadState,
		],
	);

	const cancel = useCallback(
		(threadId: string) => {
			abortControllersRef.current.get(threadId)?.abort();
			abortControllersRef.current.delete(threadId);
			setThreadState(threadId, () => emptyThreadState());
		},
		[
			setThreadState,
		],
	);

	const value: AgentRuntimeContext.Value = {
		getThreadState,
		submit,
		clearQueue,
		cancel,
	};

	return <AgentRuntimeContext.Provider value={value}>{children}</AgentRuntimeContext.Provider>;
};

// =================================================================================================

namespace submitAgentRun {
	export interface Props {
		input: AgentInputItem[];
		link: string;
		liveQuery: ReturnType<typeof withAgentLiveQuery.useSet>;
		signal: AbortSignal;
		threadId: string;
	}
}

async function submitAgentRun({
	input,
	link,
	liveQuery,
	signal,
	threadId,
}: submitAgentRun.Props): Promise<void> {
	liveQuery(() => [], {
		threadId,
	});

	const decoder = new TextDecoder();

	const parser = createParser({
		onEvent: (message) => {
			if (message.data.length === 0) {
				return;
			}

			liveQuery(
				(prev) => [
					...(prev ?? []),
					JSON.parse(message.data) as RunStreamEvent,
				],
				{
					threadId,
				},
			);
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
			signal,
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
