import { Effect } from "effect";
import { withTransactionSelectFx } from "~/server/@seller/transaction/db/withTransactionSelectFx";

export namespace withTransactionCollectionSelectFx {
	export interface Props extends withTransactionSelectFx.Props {
		//
	}

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
