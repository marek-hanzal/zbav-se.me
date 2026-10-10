import type { AgentInputItem } from "@openai/agents-core";
import { useCallback } from "react";
import { genIdFn } from "~/identity/fn/genIdFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { useAgentRuntime } from "~/user-agent/runtime/index";

type QueueTextItem = {
	input: AgentInputItem[];
};

export namespace useAgent {
	export interface Props extends MarkSuspense.Props {
		threadId: string;
	}

	export type Use = ReturnType<typeof useAgent>;
}

export const useAgent = ({ threadId }: useAgent.Props) => {
	const runtime = useAgentRuntime();
	const state = runtime.getThreadStateFn(threadId);
	const queueText = getQueueTextFn(state.queue);

	const submitFn = useCallback(
		async (input: AgentInputItem[]) => {
			runtime.submitFn(threadId, input);
		},
		[
			runtime,
			threadId,
		],
	);

	const clearQueueFn = useCallback(() => {
		runtime.clearQueueFn(threadId);
	}, [
		runtime,
		threadId,
	]);

	const cancelFn = useCallback(() => {
		runtime.cancelFn(threadId);
	}, [
		runtime,
		threadId,
	]);

	return {
		threadId,
		isPending: state.isRunning || state.queue.length > 0,
		isQueueFull: state.queue.length >= 5,
		queueSize: state.queue.length,
		queueText,
		submitFn,
		clearQueueFn,
		input: {
			textFn(text: string): AgentInputItem[] {
				return [
					{
						id: genIdFn(),
						role: "user",
						content: text.trim(),
					},
				];
			},
			imageFn(text: string, src: string[]): AgentInputItem[] {
				return [
					{
						id: genIdFn(),
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
		cancelFn,
	} as const;
};

function getQueueTextFn(queue: QueueTextItem[]): string | undefined {
	const [item] = queue;

	if (!item) {
		return undefined;
	}

	const text = item.input.map(getInputTextFn).filter(Boolean).join(" ");
	const suffix = queue.length > 1 ? ` (+${queue.length - 1})` : "";

	return `${text}${suffix}`;
}

function getInputTextFn(item: AgentInputItem): string {
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
