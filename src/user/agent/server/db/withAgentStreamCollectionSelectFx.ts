import { Effect } from "effect";
import { withAgentStreamSelectFx } from "~/user/agent/server/db/withAgentStreamSelectFx";
import type { withAgentStreamSourceSelectFx } from "./withAgentStreamSourceSelectFx";

export namespace withAgentStreamCollectionSelectFx {
	export interface Props extends withAgentStreamSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withAgentStreamCollectionSelectFx>
	>;
}

export const withAgentStreamCollectionSelectFx = Effect.fn("withAgentStreamCollectionSelectFx")(
	function* ({ sort }: withAgentStreamCollectionSelectFx.Props) {
		return yield* withAgentStreamSelectFx({
			sort,
		});
	},
);
