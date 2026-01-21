import { Effect } from "effect";
import { withListingSourceSelectFx } from "~/app/listing/db/withListingSourceSelectFx";

export namespace withListingCollectionSelectFx {
	export interface Props extends withListingSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingCollectionSelectFx>>;
}

export const withListingCollectionSelectFx = Effect.fn("withListingCollectionSelectFx")(function* ({
	sort,
	meta,
}: withListingCollectionSelectFx.Props) {
	const sourceSelect = yield* withListingSourceSelectFx({
		sort,
		meta,
	});

	return sourceSelect.select("l.id");
});
