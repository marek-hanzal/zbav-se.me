import { Effect } from "effect";
import { withTransactionSourceSelectFx } from "~/app/transaction/db/withTransactionSourceSelectFx";

export namespace withTransactionCollectionSelectFx {
	export interface Props extends withTransactionSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionCollectionSelectFx>
	>;
}

export const withTransactionCollectionSelectFx = Effect.fn("withTransactionCollectionSelectFx")(
	function* ({ sort }: withTransactionCollectionSelectFx.Props) {
		const sourceSelect = yield* withTransactionSourceSelectFx({
			sort,
		});

		return sourceSelect.select([
			"lt.id",
			"lt.updatedAt as lastAt",
		]);
	},
);
