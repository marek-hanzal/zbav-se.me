import { Effect } from "effect";
import { withMessageSelectFx } from "~/@user/message/db/withMessageSelectFx";
import type { withMessageSourceSelectFx } from "~/@user/message/db/withMessageSourceSelectFx";

export namespace withMessageCollectionSelectFx {
	export interface Props extends withMessageSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageCollectionSelectFx>>;
}

export const withMessageCollectionSelectFx = Effect.fn("withMessageCollectionSelectFx")(function* ({
	userId,
	sort,
}: withMessageCollectionSelectFx.Props) {
	const sourceSelect = yield* withMessageSelectFx({
		userId,
		sort,
	});

	return sourceSelect.selectAll("msg");
});
