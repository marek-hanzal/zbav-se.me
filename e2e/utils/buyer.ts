import { Effect } from "effect";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import type { TestDatabase } from "./database";

export type SeededTransaction = Awaited<ReturnType<typeof transactionCreateFx>>;

export async function seedBuyerTransaction(database: TestDatabase, listingId: string) {
	return Effect.gen(function* () {
		const buyer = yield* leaseTestUserFx({});

		return yield* transactionCreateFx({
			userId: buyer.id,
			listingId,
		});
	}).pipe(withRuntimeFx(database), Effect.runPromise);
}
