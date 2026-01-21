import { Effect } from "effect";
import { withMessageSourceSelectFx } from "~/app/message/db/withMessageSourceSelectFx";

export namespace withMessageSelectFx {
	export interface Props extends withMessageSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageSelectFx>>;
}

export const withMessageSelectFx = Effect.fn("withMessageSelectFx")(function* ({
	userId,
	sort,
}: withMessageSelectFx.Props) {
	const sourceSelect = yield* withMessageSourceSelectFx({
		userId,
		sort,
	});

	return sourceSelect.selectAll("msg");
});
