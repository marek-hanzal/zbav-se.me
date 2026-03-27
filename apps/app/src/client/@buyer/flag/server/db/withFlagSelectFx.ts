import { Effect } from "effect";
import { withFlagSourceSelectFx } from "~/client/@buyer/flag/server/db/withFlagSourceSelectFx";

export namespace withFlagSelectFx {
	export interface Props extends withFlagSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFlagSelectFx>>;
}

export const withFlagSelectFx = Effect.fn("withFlagSelectFx")(function* ({
	sort,
}: withFlagSelectFx.Props) {
	const sourceSelect = yield* withFlagSourceSelectFx({
		sort,
	});

	return sourceSelect.select([
		"f.id",
		"f.listingId",
	]);
});
