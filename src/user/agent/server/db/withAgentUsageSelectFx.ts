import { Effect } from "effect";
import { withAgentUsageSourceSelectFx } from "./withAgentUsageSourceSelectFx";

export namespace withAgentUsageSelectFx {
	export interface Props extends withAgentUsageSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAgentUsageSelectFx>>;
}

export const withAgentUsageSelectFx = Effect.fn("withAgentUsageSelectFx")(function* ({
	sort,
}: withAgentUsageSelectFx.Props) {
	const sourceSelect = yield* withAgentUsageSourceSelectFx({
		sort,
	});

	return sourceSelect.selectAll("au");
});
