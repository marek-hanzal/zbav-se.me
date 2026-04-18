import type { RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Icon, SpinnerIcon } from "@/lib/client/icon";
import { Typo } from "@/lib/client/typo";
import { selectThinkingState } from "./selectThinkingState";

export namespace ThinkingIndicator {
	export interface Props extends Container.Props {
		events: RunStreamEvent[] | undefined;
	}
}

export const ThinkingIndicator: FC<ThinkingIndicator.Props> = ({ events, ...props }) => {
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
