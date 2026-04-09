import type { RunItemStreamEvent } from "@openai/agents-core";
import type { StreamEventBus } from "~/user/agent/StreamEventBus";

export namespace withRunItemStreamEvent {
	export interface Props {
		eventBus: StreamEventBus;
	}
}

export const withRunItemStreamEvent = ({ eventBus }: withRunItemStreamEvent.Props) => {
	return <const TEvent extends RunItemStreamEvent>(event: TEvent) => {
		eventBus.emit("onUnhandled", {
			event,
		});
	};
};
