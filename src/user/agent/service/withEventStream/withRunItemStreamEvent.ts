import type { RunItemStreamEvent } from "@openai/agents-core";

export namespace withRunItemStreamEvent {
	export interface Props {
		enabled: true;
	}
}

export const withRunItemStreamEvent = (_props: withRunItemStreamEvent.Props) => {
	return (event: RunItemStreamEvent) => {
		console.log("Run Item event", event);
	};
};
