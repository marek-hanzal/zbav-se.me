import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import { createParser } from "eventsource-parser";
import { useEffect, useMemo, useRef } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { genId } from "@/lib/common/gen-id/genId";
import {
	agentStreamItemsQueryData,
	withAgentStreamItemsQuery,
} from "~/user/agent/query/withAgentStreamItemsQuery";
import type { AgentLiveStore } from "~/user/agent/store/AgentLiveStore";
import { useAgentLiveStore } from "~/user/agent/store/useAgentLiveStore";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

type TerminalStatus = AgentLiveStore.TerminalStatus;

export namespace useAgent {
	export interface Variables {
		text: string;
	}

	export interface Props extends MarkSuspense.Props {
		//
	}

	export type UseResult = ReturnType<typeof useAgent>;
}

export const useAgent = ({ _suspense }: useAgent.Props) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const abortControllerRef = useRef<AbortController | null>(null);
	const currentRunIdRef = useRef<string | null>(null);
	const cancelRequestedRef = useRef(false);
	const terminalStatusRef = useRef<TerminalStatus | undefined>(undefined);
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

			const runId = genId();
			const controller = new AbortController();
			const decoder = new TextDecoder();
			const parser = createParser({
				onEvent: (message) => {
					if (message.data.length === 0) {
						return;
					}

					const event = JSON.parse(message.data) as AgentEvent;
					const result = useAgentLiveStore.getState().applyEvent({
						runId,
						event,
					});

					if (result.terminalStatus) {
						terminalStatusRef.current = result.terminalStatus;
					}
				},
			});

			currentRunIdRef.current = runId;
			cancelRequestedRef.current = false;
			terminalStatusRef.current = undefined;

			useAgentLiveStore.getState().seedRun({
				runId,
				userText: trimmed,
			});

			abortControllerRef.current = controller;

			if (cancelRequestedRef.current) {
				controller.abort();
			}

			const response = await axios
				.create({
					adapter: "fetch",
				})
				.post<ReadableStream<Uint8Array>>(link.href, JSON.stringify(trimmed), {
					headers: {
						Accept: "text/event-stream",
						"Content-Type": "application/json",
					},
					signal: controller.signal,
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

			if (terminalStatusRef.current === "completed") {
				await withAgentStreamItemsQuery.invalidate(queryClient, agentStreamItemsQueryData);

				useAgentLiveStore.getState().clearRun({
					runId,
				});

				return;
			}

			if (cancelRequestedRef.current) {
				if (terminalStatusRef.current === undefined) {
					useAgentLiveStore.getState().markRun({
						runId,
						status: "cancelled",
					});

					terminalStatusRef.current = "cancelled";
				}

				return;
			}

			if (terminalStatusRef.current === undefined) {
				useAgentLiveStore.getState().markRun({
					runId,
					status: "incomplete",
				});

				terminalStatusRef.current = "incomplete";
			}
		},
		onError(error) {
			const runId = currentRunIdRef.current;
			const isCanceled =
				(axios.isAxiosError(error) && error.code === "ERR_CANCELED") ||
				error.name === "AbortError" ||
				error.name === "CanceledError";

			if (isCanceled) {
				return;
			}

			if (runId && terminalStatusRef.current === undefined) {
				useAgentLiveStore.getState().markRun({
					runId,
					status: "failed",
				});

				terminalStatusRef.current = "failed";
			}

			console.error(error);
		},
		onSettled() {
			abortControllerRef.current = null;
			currentRunIdRef.current = null;
			cancelRequestedRef.current = false;
			terminalStatusRef.current = undefined;
		},
	});

	return {
		mutation,
		cancel() {
			const runId = currentRunIdRef.current;

			if (!runId || terminalStatusRef.current !== undefined) {
				return;
			}

			cancelRequestedRef.current = true;

			if (terminalStatusRef.current === undefined) {
				useAgentLiveStore.getState().markRun({
					runId,
					status: "cancelled",
				});

				terminalStatusRef.current = "cancelled";
			}

			abortControllerRef.current?.abort();
			abortControllerRef.current = null;
		},
	} as const;
};
