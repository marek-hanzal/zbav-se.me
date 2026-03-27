import { Effect } from "effect";
import { withTransactionListingSelectFx } from "~/client/@seller/transaction-listing/server/db/withTransactionListingSelectFx";

export namespace withTransactionListingCollectionSelectFx {
	export interface Props extends withTransactionListingSelectFx.Props {}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingCollectionSelectFx>
	>;
}

export const withTransactionListingCollectionSelectFx = Effect.fn(
	"withTransactionListingCollectionSelectFx",
)(function* ({ sort }: withTransactionListingCollectionSelectFx.Props) {
	return yield* withTransactionListingSelectFx({
		sort,
	});
});
