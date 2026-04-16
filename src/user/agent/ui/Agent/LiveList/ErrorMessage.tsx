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

export const ErrorMessage: FC<ErrorMessage.Props> = ({ events, ui, ...props }) => {
	const errorState = selectErrorState(events);

	if (!errorState) {
		return null;
	}

	return (
		<Container
			data-ui={"LiveList-ErrorMessage"}
			ui={{
				flow: "vertical",
				gap: "xs",
				tone: "danger",
				...ui,
			}}
			{...props}
		>
			<Typo
				label={errorState.message}
				ui={{
					text: "sm",
					color: "lead",
				}}
			/>
		</Container>
	);
};
