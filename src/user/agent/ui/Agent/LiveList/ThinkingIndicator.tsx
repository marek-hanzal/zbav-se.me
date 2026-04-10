import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { SpinnerContainer } from "@/lib/client/spinner";
import { translator } from "@/lib/common/translator";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

function selectIsThinking(events: AgentEvent[] | undefined): boolean {
	const all = events ?? [];
	const last = all.findLast(
		(e) =>
			e.type === "response.reasoning_text.delta" || e.type === "response.reasoning_text.done",
	);
	return last?.type === "response.reasoning_text.delta";
}

export namespace ThinkingIndicator {
	export interface Props extends Container.Props {
		//
	}
}

export const ThinkingIndicator: FC<ThinkingIndicator.Props> = ({ ui, ...props }) => {
	const { data: isThinking } = withAgentLiveQuery.useQuery(undefined, {
		select: (events) => selectIsThinking(events) as unknown as AgentEvent[],
	}) as unknown as {
		data: boolean | undefined;
	};

	if (!isThinking) {
		return null;
	}

	return (
		<Container
			data-ui={"LiveList-ThinkingIndicator"}
			ui={{
				flow: "vertical",
				gap: "xs",
				...ui,
			}}
			{...props}
		>
			<SpinnerContainer
				type="icon"
				statusProps={{
					textMessage: translator.text("Agent is thinking"),
				}}
				ui={{
					layout: "horizontal-flex",
					height: undefined,
					items: "center",
					gap: "xs",
				}}
			/>
		</Container>
	);
};
