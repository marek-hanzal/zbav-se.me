import { Effect } from "effect";
import { DatabaseContextFx, DatabaseContextProvider } from "./DatabaseContextFx";

export const withTransactionFx = <A, E, R>(effect: Effect.Effect<A, E, R>) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		if (database.isTransaction) {
			return yield* effect.pipe(DatabaseContextProvider(database));
		}

		const trx = yield* Effect.tryPromise(() => database.startTransaction().execute());

		return yield* effect.pipe(
			DatabaseContextProvider(trx),
			Effect.matchEffect({
				onSuccess(value) {
					return Effect.tryPromise(async () => trx.commit()).pipe(
						Effect.map(() => value),
					);
				},
				onFailure(error) {
					return Effect.tryPromise(async () => trx.rollback()).pipe(
						Effect.flatMap(() => Effect.fail(error)),
					);
				},
			}),
		);
	});
};
