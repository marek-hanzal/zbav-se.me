import { Effect } from "effect";
import { withAgentThreadSourceSelectFx } from "./withAgentThreadSourceSelectFx";

export namespace withAgentThreadSelectFx {
	export interface Props extends withAgentThreadSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAgentThreadSelectFx>>;
}

export const withAgentThreadSelectFx = Effect.fn("withAgentThreadSelectFx")(function* ({
	sort,
}: withAgentThreadSelectFx.Props) {
	const sourceSelect = yield* withAgentThreadSourceSelectFx({
		sort,
	});

	return sourceSelect.selectAll("at");
});
