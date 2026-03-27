import { Effect } from "effect";
import { withTransactionSelectFx } from "~/buyer/transaction/server/db/withTransactionSelectFx";
import type { withTransactionSourceSelectFx } from "~/buyer/transaction/server/db/withTransactionSourceSelectFx";

export namespace withTransactionCollectionSelectFx {
	export interface Props extends withTransactionSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionCollectionSelectFx>
	>;
}

export const withTransactionCollectionSelectFx = Effect.fn("withTransactionCollectionSelectFx")(
	function* ({ sort }: withTransactionCollectionSelectFx.Props) {
		return yield* withTransactionSelectFx({
			sort,
		});
	},
);
