import type { RunStreamEvent } from "@openai/agents";
import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { getFunctionCallResultItem } from "~/user/agent/type/getFunctionCallResultItem";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

export namespace ThinkingIndicator {
	export interface Props extends Group.Props {
		events: RunStreamEvent[] | undefined;
	}
}

export const ThinkingIndicator: FC<ThinkingIndicator.Props> = ({ events, ...props }) => {
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
					label={translator.text("Agent working (label)")}
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
			const result = getFunctionCallResultItem(event);

			if (result) {
				pendingToolCallIds.delete(result.callId);
				isVisible = pendingToolCallIds.size === 0;
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
