import { Effect } from "effect";
import { withListingSelectFx } from "~/server/@buyer/listing/db/withListingSelectFx";

export namespace withListingCollectionSelectFx {
	export interface Props extends withListingSelectFx.Props {
		//
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingCollectionSelectFx>>;
}

export const withListingCollectionSelectFx = Effect.fn("withListingCollectionSelectFx")(function* ({
	userId,
	sort,
	meta,
}: withListingCollectionSelectFx.Props) {
	return yield* withListingSelectFx({
		userId,
		sort,
		meta,
	});
});
