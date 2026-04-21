import { Effect } from "effect";
import { withAgentThreadSelectFx } from "~/user/agent/server/db/withAgentThreadSelectFx";
import type { withAgentThreadSourceSelectFx } from "./withAgentThreadSourceSelectFx";

export namespace withAgentThreadCollectionSelectFx {
	export interface Props extends withAgentThreadSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withAgentThreadCollectionSelectFx>
	>;
}

export const withAgentThreadCollectionSelectFx = Effect.fn("withAgentThreadCollectionSelectFx")(
	function* ({ sort }: withAgentThreadCollectionSelectFx.Props) {
		return yield* withAgentThreadSelectFx({
			sort,
		});
	},
);
