import type { RunStreamEvent } from "@openai/agents-core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import axios from "axios";
import { createParser } from "eventsource-parser";
import { useEffect, useMemo, useRef } from "react";
import type { MarkSuspense } from "@/lib/client/type";

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

			const parser = createParser({
				onEvent(event) {
					if (!event.data) {
						return;
					}

					const item = JSON.parse(event.data) as RunStreamEvent;

					console.log("Event", item);
				},
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
