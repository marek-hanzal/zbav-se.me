import { Effect } from "effect";
import { type TransactionContext, TransactionContextFx } from "./TransactionContextFx";

export function withTransactionContextFx(context: TransactionContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(TransactionContextFx, context));
	};
}
