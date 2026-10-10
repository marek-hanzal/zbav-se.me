import type { RunStreamEvent } from "@openai/agents";
import { type FC, useMemo } from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { getFunctionCallResultItemFn } from "~/user-agent/fn/getFunctionCallResultItemFn";
import { getResponseStreamEventFn } from "~/user-agent/fn/getResponseStreamEventFn";

export namespace ThinkingIndicator {
	export interface Props extends Group.Props {
		events: RunStreamEvent[] | undefined;
	}
}

export const ThinkingIndicator: FC<ThinkingIndicator.Props> = ({ events, ...props }) => {
	const translator = useTranslator();
	const state = useThinking(events);
	if (!state.isVisible) {
		return null;
	}

	return (
		<Group
			data-ui={"ThinkingIndicator"}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-background="default"
			data-ui-inner="default"
			data-ui-color={"lead"}
			{...props}
		>
			<Container
				data-ui-flow={"horizontal"}
				data-ui-gap={"default"}
				data-ui-items={"center"}
			>
				<Tx
					label={translator.textFn("Agent working (label)")}
					data-ui-text="sm"
					data-ui-font="bold"
					className={[
						"wrap-break-word",
					]}
				/>

				<SpinnerContainer
					data-ui-tone={"neutral"}
					type={"icon"}
					data-ui-text={"default"}
				/>
			</Container>
		</Group>
	);
};

// =================================================================================================

function useThinking(events: RunStreamEvent[] | undefined) {
	return useMemo(() => {
		let isVisible = false;
		const pendingToolCallIds = new Set<string>();

		for (const event of events ?? []) {
			const result = getFunctionCallResultItemFn(event);

			if (result) {
				pendingToolCallIds.delete(result.callId);
				isVisible = pendingToolCallIds.size === 0;
				continue;
			}

			const responseEvent = getResponseStreamEventFn(event);

			if (!responseEvent) {
				continue;
			}

			if (
				responseEvent.type === "response.created" ||
				responseEvent.type === "response.in_progress"
			) {
				isVisible = true;
				continue;
			}

			if (
				responseEvent.type === "response.completed" ||
				responseEvent.type === "response.failed"
			) {
				isVisible = false;
				continue;
			}

			if (
				responseEvent.type === "response.output_text.delta" ||
				responseEvent.type === "response.output_text.done"
			) {
				isVisible = false;
				continue;
			}

			if (responseEvent.type === "response.reasoning_text.delta") {
				isVisible = false;
				continue;
			}

			if (responseEvent.type === "response.reasoning_text.done") {
				isVisible = false;
				continue;
			}

			if (
				responseEvent.type === "response.output_item.added" &&
				responseEvent.item.type === "message"
			) {
				isVisible = true;
				continue;
			}

			if (
				responseEvent.type === "response.output_item.added" &&
				responseEvent.item.type === "function_call"
			) {
				pendingToolCallIds.add(responseEvent.item.call_id);
				isVisible = false;
				continue;
			}

			if (responseEvent.type === "response.function_call_arguments.done") {
				isVisible = pendingToolCallIds.size === 0;
			}
		}

		return {
			isVisible,
		} as const;
	}, [
		events,
	]);
}
