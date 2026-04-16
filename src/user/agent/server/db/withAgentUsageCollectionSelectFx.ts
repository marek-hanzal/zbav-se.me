import { Effect } from "effect";
import { withAgentUsageSelectFx } from "~/user/agent/server/db/withAgentUsageSelectFx";
import type { withAgentUsageSourceSelectFx } from "./withAgentUsageSourceSelectFx";

export namespace withAgentUsageCollectionSelectFx {
	export interface Props extends withAgentUsageSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAgentUsageCollectionSelectFx>>;
}

export const withAgentUsageCollectionSelectFx = Effect.fn("withAgentUsageCollectionSelectFx")(
	function* ({ sort }: withAgentUsageCollectionSelectFx.Props) {
		return yield* withAgentUsageSelectFx({
			sort,
		});
	},
);
