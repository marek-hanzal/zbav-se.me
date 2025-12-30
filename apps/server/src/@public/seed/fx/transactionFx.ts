import { Effect } from "effect";
import { seedTransactionsFx } from "~/@public/seed/fx/seedTransactionsFx";

export namespace transactionFx {
	export interface Props {
		transaction: seedTransactionsFx.Props;
	}
}

export const transactionFx = ({ transaction }: transactionFx.Props) => {
	return Effect.gen(function* () {
		yield* seedTransactionsFx(transaction);
	});
};
