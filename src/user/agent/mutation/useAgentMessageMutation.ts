import { useDebouncer } from "@tanstack/react-pacer/debouncer";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { useCallback, useEffect, useRef, useState } from "react";
import { genId } from "@/lib/common/gen-id";
import { getResponseError } from "~/user/assistant/service/getResponseError";

export namespace useAgentMessageMutation {
	export interface Variables {
		text: string;
	}

	export interface Run {
		id: string;
		userText: string;
		events: unknown[];
	}
}

export const useAgentMessageMutation = () => {
	const { buildLocation } = useRouter();
	// const agentQuery = withAgentStreamQuery.useQuery({
	// 	sort: [
	// 		{
	// 			field: "sort",
	// 			order: "asc",
	// 		},
	// 	],
	// });
	const abortControllerRef = useRef<AbortController | null>(null);
	const activeRunIdRef = useRef<string | null>(null);
	const pendingEventsRef = useRef<unknown[]>([]);
	const historyItems = [] as any[];
	const [runs, setRuns] = useState<useAgentMessageMutation.Run[]>([]);
	const link = buildLocation({
		to: "/api/user/agent",
	});

	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const flushPendingEvents = useCallback(() => {
		const runId = activeRunIdRef.current;
		const nextEvents = pendingEventsRef.current;

		if (!runId || nextEvents.length === 0) {
			return;
		}

		pendingEventsRef.current = [];
		setRuns((runs) => {
			return runs.map((run) => {
				if (run.id !== runId) {
					return run;
				}

				return {
					...run,
					events: [
						...run.events,
						...nextEvents,
					],
				};
			});
		});
	}, []);

	const eventsDebouncer = useDebouncer(flushPendingEvents, {
		wait: 32,
		onUnmount(debouncer) {
			debouncer.flush();
		},
	});

	const stop = useCallback(() => {
		abortControllerRef.current?.abort();
	}, []);

	const mutation = useMutation<void, Error, useAgentMessageMutation.Variables>({
		async mutationFn({ text }) {
			const trimmed = text.trim();

			if (trimmed.length === 0) {
				return;
			}

			const controller = new AbortController();
			const runId = genId();

			abortControllerRef.current = controller;
			activeRunIdRef.current = runId;
			pendingEventsRef.current = [];
			setRuns((runs) => {
				return [
					...runs,
					{
						id: runId,
						userText: trimmed,
						events: [],
					},
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
					pendingEventsRef.current.push(event);
					eventsDebouncer.maybeExecute();
				}

				eventsDebouncer.flush();
			} catch (error) {
				eventsDebouncer.flush();

				if (error instanceof Error && error.name === "AbortError") {
					return;
				}

				throw error;
			}
		},
		onSettled() {
			eventsDebouncer.flush();
			abortControllerRef.current = null;
			activeRunIdRef.current = null;
		},
	});

	return {
		historyItems,
		mutation,
		runs,
		stop,
	};
};
