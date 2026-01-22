import { Effect } from "effect";
import { withListingEventSourceSelectFx } from "~/@session/listing-event/db/withListingEventSourceSelectFx";

export namespace withListingEventCollectionSelectFx {
	export interface Props extends withListingEventSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withListingEventCollectionSelectFx>
	>;
}

export const withListingEventCollectionSelectFx = Effect.fn("withListingEventCollectionSelectFx")(
	function* ({ sort }: withListingEventCollectionSelectFx.Props) {
		const sourceSelect = yield* withListingEventSourceSelectFx({
			sort,
		});

		return sourceSelect.select("le.id");
	},
);
