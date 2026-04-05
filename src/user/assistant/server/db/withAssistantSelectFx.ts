import { Effect } from "effect";
import { withAssistantSourceSelectFx } from "~/user/assistant/server/db/withAssistantSourceSelectFx";

export namespace withAssistantSelectFx {
	export interface Props extends withAssistantSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withAssistantSelectFx>>;
}

export const withAssistantSelectFx = Effect.fn("withAssistantSelectFx")(function* ({
	sort,
}: withAssistantSelectFx.Props) {
	const sourceSelect = yield* withAssistantSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"a.id",
		"a.userId",
		"a.payload",
		"a.createdAt",
	]);
});
