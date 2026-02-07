import { Context, Effect } from "effect";
import { DefaultTransactionContext } from "~/@common/transaction/context/DefaultTransactionContext";

export interface TransactionContext {
	/**
	 * Number of days until a transaction expires.
	 * Defaults to 3 days.
	 */
	expires: number;
	/**
	 * Number of days to extend a transaction.
	 */
	extend: number;
}

export class TransactionContextFx extends Context.Tag("TransactionContextFx")<
	TransactionContextFx,
	TransactionContext
>() {
	//
}

export const withTransactionContextFx =
	(context: TransactionContext = DefaultTransactionContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provideService(TransactionContextFx, context));
