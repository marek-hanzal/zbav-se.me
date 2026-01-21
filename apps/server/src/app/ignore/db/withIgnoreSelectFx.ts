import { Effect } from "effect";
import { withIgnoreSourceSelectFx } from "~/app/ignore/db/withIgnoreSourceSelectFx";

export namespace withIgnoreSelectFx {
	export interface Props extends withIgnoreSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withIgnoreSelectFx>>;
}

export const withIgnoreSelectFx = Effect.fn("withIgnoreSelectFx")(function* ({
	sort,
}: withIgnoreSelectFx.Props) {
	const sourceSelect = yield* withIgnoreSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"i.id",
		"i.listingId",
	]);
});
