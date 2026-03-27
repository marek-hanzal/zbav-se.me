import { Effect } from "effect";
import { withListingSelectFx } from "~/server/@public/listing/db/withListingSelectFx";

export namespace withListingCollectionSelectFx {
	export interface Props extends withListingSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingCollectionSelectFx>>;
}

export const withListingCollectionSelectFx = Effect.fn("withListingCollectionSelectFx")(function* ({
	sort,
	meta,
}: withListingCollectionSelectFx.Props) {
	return yield* withListingSelectFx({
		sort,
		meta,
	});
});
