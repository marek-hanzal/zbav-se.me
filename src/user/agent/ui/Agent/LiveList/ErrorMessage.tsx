import type { RunStreamEvent } from "@openai/agents";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo } from "@/lib/client/typo";
import { selectErrorState } from "./selectErrorState";

export namespace ErrorMessage {
	export interface Props extends Container.Props {
		events: RunStreamEvent[] | undefined;
	}
}

export const ErrorMessage: FC<ErrorMessage.Props> = ({ events, ...props }) => {
	const errorState = selectErrorState(events);

	if (!errorState) {
		return null;
	}

	return (
		<Container
			data-ui="ErrorMessage"
			data-ui-flow="vertical"
			data-ui-gap="xs"
			data-ui-tone="danger"
			{...props}
		>
			<Typo
				label={errorState.message}
				data-ui-text="sm"
				data-ui-color="lead"
			/>
		</Container>
	);
};
