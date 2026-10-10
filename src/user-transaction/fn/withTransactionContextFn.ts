import { Effect } from "effect";
import { TransactionContextFx } from "~/user-transaction/context/TransactionContextFx";

// export function withTransactionContextFx(context: TransactionContext) {
export function withTransactionContextFn() {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(
			Effect.provideService(TransactionContextFx, {
				expires: 3,
				extend: 3,
			}),
		);
	};
}
