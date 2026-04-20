import type { RunStreamEvent } from "@openai/agents";
import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { Icon, SpinnerIcon } from "@/lib/client/icon";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { getFunctionCallResultItem } from "~/user/agent/type/getFunctionCallResultItem";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

export namespace ThinkingIndicator {
	export interface Props extends Container.Props {
		events: RunStreamEvent[] | undefined;
	}
}

export const ThinkingIndicator: FC<ThinkingIndicator.Props> = ({ events, ...props }) => {
	const state = useThinking(events);
	if (!state.isVisible) {
		return null;
	}

	return (
		<Container
			data-ui={"ThinkingIndicator"}
			data-ui-layout="horizontal-flex"
			data-ui-items="center"
			data-ui-gap="xs"
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-text="sm"
			{...props}
		>
			<Icon
				icon={SpinnerIcon}
				data-ui-text="sm"
			/>

			{state.label !== null ? (
				<Typo
					label={state.label}
					data-ui-text="sm"
					data-ui-font="semibold"
					data-ui-color="lead"
				/>
			) : null}
		</Container>
	);
};

// =================================================================================================

function useThinking(events: RunStreamEvent[] | undefined) {
	return useMemo(() => {
		let isVisible = false;
		let label: string | null = null;
		const pendingToolCallIds = new Set<string>();

		for (const event of events ?? []) {
			const result = getFunctionCallResultItem(event);

			if (result) {
				pendingToolCallIds.delete(result.callId);
				isVisible = pendingToolCallIds.size === 0;
				label = isVisible ? translator.text("Reasoning") : null;
				continue;
			}

			const responseEvent = getResponseStreamEvent(event);

			if (!responseEvent) {
				continue;
			}

			if (
				responseEvent.type === "response.created" ||
				responseEvent.type === "response.in_progress"
			) {
				isVisible = true;
				label = null;
				continue;
			}

			if (
				responseEvent.type === "response.completed" ||
				responseEvent.type === "response.failed"
			) {
				isVisible = false;
				label = null;
				continue;
			}

			if (
				responseEvent.type === "response.output_text.delta" ||
				responseEvent.type === "response.output_text.done"
			) {
				isVisible = false;
				label = null;
				continue;
			}

			if (responseEvent.type === "response.reasoning_text.delta") {
				isVisible = true;
				label = translator.text("Reasoning");
				continue;
			}

			if (responseEvent.type === "response.reasoning_text.done") {
				isVisible = true;
				label = null;
				continue;
			}

			if (
				responseEvent.type === "response.output_item.added" &&
				responseEvent.item.type === "message"
			) {
				isVisible = true;
				label = translator.text("Reasoning");
				continue;
			}

			if (
				responseEvent.type === "response.output_item.added" &&
				responseEvent.item.type === "function_call"
			) {
				pendingToolCallIds.add(responseEvent.item.call_id);
				isVisible = false;
				label = null;
				continue;
			}

			if (responseEvent.type === "response.function_call_arguments.done") {
				isVisible = pendingToolCallIds.size === 0;
				label = null;
			}
		}

		return {
			isVisible,
			label,
		} as const;
	}, [
		events,
	]);
}
