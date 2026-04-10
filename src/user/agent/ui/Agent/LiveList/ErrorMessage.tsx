import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { withAgentLiveQuery } from "~/user/agent/query/withAgentLiveQuery";
import type { AgentEvent } from "~/user/agent/type/AgentEvent";

interface ErrorState {
	message: string;
}

function selectErrorState(events: AgentEvent[] | undefined): ErrorState | null {
	const all = events ?? [];
	const errorEvent = all.findLast((e) => e.type === "response.failed" || e.type === "error");

	if (!errorEvent) {
		return null;
	}

	if (errorEvent.type === "error") {
		return {
			message: errorEvent.message,
		};
	}

	if (errorEvent.type === "response.failed") {
		return {
			message: translator.text("Agent stream failed"),
		};
	}

	return null;
}

export namespace ErrorMessage {
	export interface Props extends Container.Props {
		//
	}
}

export const ErrorMessage: FC<ErrorMessage.Props> = ({ ui, ...props }) => {
	const { data: errorState } = withAgentLiveQuery.useQuery(undefined, {
		select: (events) => selectErrorState(events) as unknown as AgentEvent[],
	}) as unknown as {
		data: ErrorState | null | undefined;
	};

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
