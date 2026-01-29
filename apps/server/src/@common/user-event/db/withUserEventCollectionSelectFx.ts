import { Effect } from "effect";
import { withUserEventSourceSelectFx } from "~/@common/user-event/db/withUserEventSourceSelectFx";

export namespace withUserEventCollectionSelectFx {
	export interface Props extends withUserEventSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withUserEventCollectionSelectFx>>;
}

export const withUserEventCollectionSelectFx = Effect.fn("withUserEventCollectionSelectFx")(
	function* ({ sort }: withUserEventCollectionSelectFx.Props) {
		const sourceSelect = yield* withUserEventSourceSelectFx({
			sort,
		});

		return sourceSelect.selectAll("ue");
	},
);
