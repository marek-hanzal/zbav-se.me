import { Effect } from "effect";
import { withListingSelectFx } from "~/buyer/listing/server/db/withListingSelectFx";

export namespace withListingCollectionSelectFx {
	export interface Props extends withListingSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingCollectionSelectFx>>;
}

export const withListingCollectionSelectFx = Effect.fn("withListingCollectionSelectFx")(function* (
	props: withListingCollectionSelectFx.Props,
) {
	return yield* withListingSelectFx(props);
});
