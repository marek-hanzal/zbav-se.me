import { Effect } from "effect";
import { withAgentStreamSourceSelectFx } from "./withAgentStreamSourceSelectFx";

export namespace withAgentStreamSelectFx {
	export interface Props extends withAgentStreamSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAgentStreamSelectFx>>;
}

export const withAgentStreamSelectFx = Effect.fn("withAgentStreamSelectFx")(function* ({
	sort,
}: withAgentStreamSelectFx.Props) {
	const sourceSelect = yield* withAgentStreamSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"as.id",
		"as.userId",
		"as.threadId",
		"as.payload",
		"as.sort",
	]);
});
