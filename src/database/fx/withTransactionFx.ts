import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { dbFx } from "~/database/fx/dbFx";

export const withTransactionFx = Effect.fn("withTransactionFx")(function* <
	const A,
	const E,
	const R,
>(effect: Effect.Effect<A, E, R>) {
	const kysely = yield* KyselyContextFx;

	if (kysely.kysely.isTransaction) {
		return yield* effect.pipe(withKyselyFn(kysely));
	}

	const trx = yield* dbFx(async (kysely) => kysely.startTransaction().execute());

	return yield* effect.pipe(
		withKyselyFn({
			...kysely,
			kysely: trx,
		}),
		Effect.matchEffect({
			onSuccess(value) {
				return dbFx(async () => trx.commit().execute()).pipe(Effect.map(() => value));
			},
			onFailure(error) {
				return dbFx(async () => trx.rollback().execute()).pipe(
					Effect.flatMap(() => Effect.fail(error)),
				);
			},
		}),
	);
});
