import { Effect } from "effect";
import { withTransactionSelectFx } from "~/server/@buyer/transaction/db/withTransactionSelectFx";
import type { withTransactionSourceSelectFx } from "~/server/@buyer/transaction/db/withTransactionSourceSelectFx";

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
