import type { RunStreamEvent } from "@openai/agents";
import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { useTranslator } from "@/lib/client/translation";
import { Typo } from "@/lib/client/typo";
import { getResponseStreamEvent } from "~/user/agent/type/getResponseStreamEvent";

export namespace ErrorMessage {
	export interface Props extends Container.Props {
		events: RunStreamEvent[] | undefined;
	}
}

export const ErrorMessage: FC<ErrorMessage.Props> = ({ events, ...props }) => {
	const errorState = useErrorState(events);

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

// =================================================================================================

function useErrorState(events: RunStreamEvent[] | undefined) {
	const translator = useTranslator();

	return useMemo(() => {
		const errorEvent = (events ?? [])
			.map(getResponseStreamEvent)
			.filter((event) => event !== null)
			.findLast((event) => event.type === "response.failed");

		if (!errorEvent) {
			return null;
		}

		return {
			message: translator.text(errorEvent.response.error?.message ?? "Agent stream failed"),
		} as const;
	}, [
		events,
		translator,
	]);
}
