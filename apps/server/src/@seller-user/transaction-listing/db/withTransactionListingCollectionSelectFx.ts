import { Effect } from "effect";
import { withTransactionListingSelectFx } from "~/@seller-user/transaction-listing/db/withTransactionListingSelectFx";

export namespace withTransactionListingCollectionSelectFx {
	export interface Props extends withTransactionListingSelectFx.Props {}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingCollectionSelectFx>
	>;
}

export const withTransactionListingCollectionSelectFx = Effect.fn(
	"withTransactionListingCollectionSelectFx",
)(function* ({ sort }: withTransactionListingCollectionSelectFx.Props) {
	const sourceSelect = yield* withTransactionListingSelectFx({
		sort,
	});

	return sourceSelect;
});
