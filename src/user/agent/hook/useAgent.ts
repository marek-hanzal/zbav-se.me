import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import { createParser } from "eventsource-parser";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { match } from "ts-pattern";
import type { MarkSuspense } from "@/lib/client/type";
import { withAgentStreamItemsQuery } from "~/user/agent/query/withAgentStreamItemsQuery";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

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
	const abortControllerRef = useRef<AbortController | null>(null);
	const { data: messages } = withAgentStreamItemsQuery.useSuspenseQuery({
		sort: [
			{
				field: "sort",
				order: "asc",
			},
		],
		cursor: {
			page: 0,
			size: 128,
		},
	});
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

	const onStream = useCallback((event: AgentEvent) => {
		match(event)
			.with(
				{
					type: "response.created",
				},
				(event) => {
					console.log("Response Created", event);
				},
			)
			.otherwise((event) => {
				console.log("[Unhandled event]", event);
			});
	}, []);

	const mutation = useMutation<void, Error, useAgent.Variables>({
		async mutationFn({ text }) {
			const trimmed = text.trim();

			if (trimmed.length === 0) {
				return;
			}

			const parser = createParser({
				onEvent(event) {
					if (!event.data) {
						return;
					}

					onStream(JSON.parse(event.data));
				},
			});

			abortControllerRef.current = new AbortController();

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
			const decoder = new TextDecoder();

			for (;;) {
				const { done, value } = await reader.read();

				if (done) {
					break;
				}

				parser.feed(
					decoder.decode(value, {
						stream: true,
					}),
				);
			}

			parser.feed(decoder.decode());

			parser.reset({
				consume: true,
			});
		},
		onError(e) {
			console.error(e);
		},
		onSettled() {
			abortControllerRef.current = null;
		},
	});

	return {
		mutation,
		cancel() {
			abortControllerRef.current?.abort();
			abortControllerRef.current = null;
		},
	} as const;
};
