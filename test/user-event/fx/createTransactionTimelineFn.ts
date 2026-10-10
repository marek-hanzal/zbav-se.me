import type { DateTime } from "luxon";
import type { userEventCreateFx } from "~/user-event/fx/userEventCreateFx";

namespace createTransactionTimelineFn {
	export interface Step {
		at: DateTime;
		scope: userEventCreateFx.Props["scope"];
		event: userEventCreateFx.Props["event"];
		isTerminal: boolean;
	}

	export interface Props {
		group: string;
		steps: Step[];
	}
}

export const createTransactionTimelineFn = ({ group, steps }: createTransactionTimelineFn.Props) =>
	steps.map((step) => ({
		at: step.at,
		group,
		scope: step.scope,
		source: "transaction" as const,
		event: step.event,
		isTerminal: step.isTerminal,
	}));
