import type { AgentInputItem } from "@openai/agents-core";
import { useCallback } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { genId } from "@/lib/common/gen-id";
import { useAgentRuntime } from "~/user/agent/runtime";

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
	const state = runtime.getThreadState(threadId);
	const queueText = getQueueText(state.queue);

	const submit = useCallback(
		async (input: AgentInputItem[]) => {
			runtime.submit(threadId, input);
		},
		[
			runtime,
			threadId,
		],
	);

	const clearQueue = useCallback(() => {
		runtime.clearQueue(threadId);
	}, [
		runtime,
		threadId,
	]);

	const cancel = useCallback(() => {
		runtime.cancel(threadId);
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

function getQueueText(queue: QueueTextItem[]): string | undefined {
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
