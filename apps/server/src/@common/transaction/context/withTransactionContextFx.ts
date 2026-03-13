import { Effect } from "effect";
import { DefaultTransactionContext } from "~/@common/transaction/context/DefaultTransactionContext";
import {
	type TransactionContext,
	TransactionContextFx,
} from "~/@common/transaction/context/TransactionContextFx";

export const withTransactionContextFx =
	(context: TransactionContext = DefaultTransactionContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provideService(TransactionContextFx, context));
