import { Effect } from "effect";
import { withAssistantSelectFx } from "~/user/assistant/server/db/withAssistantSelectFx";
import type { withAssistantSourceSelectFx } from "~/user/assistant/server/db/withAssistantSourceSelectFx";

export namespace withAssistantCollectionSelectFx {
	export interface Props extends withAssistantSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAssistantCollectionSelectFx>>;
}

export const withAssistantCollectionSelectFx = Effect.fn("withAssistantCollectionSelectFx")(
	function* ({ sort }: withAssistantCollectionSelectFx.Props) {
		return yield* withAssistantSelectFx({
			sort,
		});
	},
);
