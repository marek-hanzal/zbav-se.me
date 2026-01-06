import { Effect } from "effect";
import { seedTransactionsFx } from "~/@public/seed/fx/seedTransactionsFx";

export namespace transactionFx {
	export interface Props {
		transaction: seedTransactionsFx.Props;
	}
}

export const transactionFx = Effect.fn("transactionFx")(function* ({
	transaction,
}: transactionFx.Props) {
	yield* seedTransactionsFx(transaction);
});
