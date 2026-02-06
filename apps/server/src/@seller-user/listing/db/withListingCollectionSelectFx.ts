import { Effect } from "effect";
import { withListingSourceSelectFx } from "~/@seller-user/listing/db/withListingSourceSelectFx";

export namespace withListingCollectionSelectFx {
	export interface Props extends withListingSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingCollectionSelectFx>>;
}

export const withListingCollectionSelectFx = Effect.fn("withListingCollectionSelectFx")(function* ({
	sort,
}: withListingCollectionSelectFx.Props) {
	const sourceSelect = yield* withListingSourceSelectFx({
		sort,
	});

	return sourceSelect.select("l.id");
});
