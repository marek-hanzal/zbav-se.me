import { Effect } from "effect";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";

export const withTransactionFx = Effect.fn("withTransactionFx")(function* <
	const A,
	const E,
	const R,
>(effect: Effect.Effect<A, E, R>) {
	const kysely = yield* KyselyContextFx;

	if (kysely.kysely.isTransaction) {
		return yield* effect.pipe(withKyselyFx(kysely));
	}

	const trx = yield* tryDbFx(async () => kysely.kysely.startTransaction().execute());

	return yield* effect.pipe(
		withKyselyFx({
			...kysely,
			kysely: trx,
		}),
		Effect.matchEffect({
			onSuccess(value) {
				return tryDbFx(async () => trx.commit().execute()).pipe(Effect.map(() => value));
			},
			onFailure(error) {
				return tryDbFx(async () => trx.rollback().execute()).pipe(
					Effect.flatMap(() => Effect.fail(error)),
				);
			},
		}),
	);
});
