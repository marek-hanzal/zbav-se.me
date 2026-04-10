import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import { createParser } from "eventsource-parser";
import { useEffect, useMemo, useRef } from "react";
import type { MarkSuspense } from "@/lib/client/type";
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

			const controller = new AbortController();
			const decoder = new TextDecoder();
			const parser = createParser({
				onEvent: (message) => {
					if (message.data.length === 0) {
						return;
					}

					/**
					 * Process this event within UI
					 */
					JSON.parse(message.data) as AgentEvent;
				},
			});

			abortControllerRef.current = controller;

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
		},
		onError(error) {
			console.error(error);
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
