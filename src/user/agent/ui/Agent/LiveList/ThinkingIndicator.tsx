import type { RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Icon, SpinnerIcon } from "@/lib/client/icon";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import { getResponseStreamEvent } from "~/user/agent/type/AgentEvent";

export namespace ThinkingIndicator {
	export interface Props extends Container.Props {
		//
	}
}

interface ThinkingState {
	isVisible: boolean;
	label: string | null;
}

function selectThinkingState(events: RunStreamEvent[] | undefined): ThinkingState {
	let isVisible = false;
	let label: string | null = null;
	let hasOutputTextStarted = false;

	for (const event of events ?? []) {
		const responseEvent = getResponseStreamEvent(event);

		if (!responseEvent) {
			continue;
		}

		if (
			responseEvent.type === "response.output_text.delta" ||
			responseEvent.type === "response.output_text.done"
		) {
			hasOutputTextStarted = true;
			isVisible = false;
			label = null;
			continue;
		}

		if (hasOutputTextStarted) {
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
			responseEvent.item.type === "function_call"
		) {
			isVisible = true;
			label = translator.text("Tool call");
			continue;
		}

		if (responseEvent.type === "response.function_call_arguments.done") {
			isVisible = true;
			label = null;
			continue;
		}

		if (responseEvent.type === "response.failed" || responseEvent.type === "error") {
			isVisible = false;
			label = null;
		}
	}

	return {
		isVisible,
		label,
	};
}

export const ThinkingIndicator: FC<ThinkingIndicator.Props> = ({ ui, ...props }) => {
	const { data: events } = withAgentLiveQuery.useQuery(undefined);
	const state = selectThinkingState(events);

	if (!state.isVisible) {
		return null;
	}

	return (
		<Container
			data-ui={"LiveList-ThinkingIndicator"}
			ui={{
				layout: "horizontal-flex",
				items: "center",
				gap: "xs",
				tone: "neutral",
				theme: "light",
				text: "sm",
				...ui,
			}}
			{...props}
		>
			<Icon
				data-ui={"LiveList-ThinkingIndicator-[Spinner]"}
				icon={SpinnerIcon}
				ui={{
					text: "sm",
				}}
			/>

			{state.label !== null ? (
				<Typo
					label={state.label}
					ui={{
						text: "sm",
						font: "semibold",
						color: "lead",
					}}
				/>
			) : null}
		</Container>
	);
};
