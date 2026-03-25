import { Effect } from "effect";
import { withListingEventSourceSelectFx } from "~/server/@buyer/listing-event/db/withListingEventSourceSelectFx";

export namespace withListingEventSelectFx {
	export interface Props extends withListingEventSourceSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingEventSelectFx>>;
}

export const withListingEventSelectFx = Effect.fn("withListingEventSelectFx")(function* ({
	sort,
}: withListingEventSelectFx.Props) {
	const sourceSelect = yield* withListingEventSourceSelectFx({
		sort,
	});

	return sourceSelect.selectAll("le");
});
