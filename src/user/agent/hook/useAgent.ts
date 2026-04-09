import type { RunStreamEvent } from "@openai/agents-core";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { EventSourceParserStream } from "eventsource-parser/stream";
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
	//
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

			try {
				const response = await fetch(link.href, {
					method: "POST",
					headers: {
						Accept: "text/event-stream",
						"Content-Type": "application/json",
					},
					body: JSON.stringify(trimmed),
					signal: abortControllerRef.current.signal,
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

					const event = JSON.parse(value.data) as RunStreamEvent;

					//
				}
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError") {
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
		mutation,
	};
};
