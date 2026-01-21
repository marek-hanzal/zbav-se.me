import { Effect } from "effect";
import { withMessageSourceSelectFx } from "~/app/message/db/withMessageSourceSelectFx";

export namespace withMessageCollectionSelectFx {
	export interface Props extends withMessageSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageCollectionSelectFx>>;
}

export const withMessageCollectionSelectFx = Effect.fn("withMessageCollectionSelectFx")(function* ({
	userId,
	sort,
}: withMessageCollectionSelectFx.Props) {
	const sourceSelect = yield* withMessageSourceSelectFx({
		userId,
		sort,
	});

	return sourceSelect.select("msg.id");
});
