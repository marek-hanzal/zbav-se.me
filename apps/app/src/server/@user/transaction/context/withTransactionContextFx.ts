import { Effect } from "effect";
import { TransactionContextFx } from "./TransactionContextFx";

// export function withTransactionContextFx(context: TransactionContext) {
export function withTransactionContextFx() {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(
			Effect.provideService(TransactionContextFx, {
				expires: 3,
				extend: 3,
			}),
		);
	};
}
