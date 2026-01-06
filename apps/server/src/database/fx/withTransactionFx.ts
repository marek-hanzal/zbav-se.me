import { Effect } from "effect";
import { DatabaseContextFx, DatabaseContextProvider } from "./DatabaseContextFx";

export const withTransactionFx = Effect.fn("withTransactionFx")(function* <
	const A,
	const E,
	const R,
>(effect: Effect.Effect<A, E, R>) {
	const database = yield* DatabaseContextFx;

	if (database.isTransaction) {
		return yield* effect.pipe(DatabaseContextProvider(database));
	}

	const trx = yield* Effect.promise(async () => database.startTransaction().execute());

	return yield* effect.pipe(
		DatabaseContextProvider(trx),
		Effect.matchEffect({
			onSuccess(value) {
				return Effect.promise(async () => trx.commit().execute()).pipe(
					Effect.map(() => value),
				);
			},
			onFailure(error) {
				return Effect.promise(async () => trx.rollback().execute()).pipe(
					Effect.flatMap(() => Effect.fail(error)),
				);
			},
		}),
	);
});
