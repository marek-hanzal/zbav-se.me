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
			data-ui-layout="horizontal-flex"
			data-ui-items="center"
			data-ui-gap="xs"
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-text="sm"
			{...props}
		>
			<Icon
				data-ui={"LiveList-ThinkingIndicator-[Spinner]"}
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
