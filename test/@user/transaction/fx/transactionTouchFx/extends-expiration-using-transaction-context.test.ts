import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionTouchFx } from "~/user-transaction/fx/transactionTouchFx";

describe("transactionTouchFx", () => {
	it("updates timestamps and extends expiration from the touched moment", async () => {
		const database = await testabaseFn("transactionTouchFx-direct");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const before = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			yield* Effect.promise(() => new Promise((resolveFn) => setTimeout(resolveFn, 25)));

			const touchedAt = DateTime.now();
			yield* transactionTouchFx({
				transactionId,
				userId: seller.id,
			});

			const after = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(after.updatedAt.getTime()).toBeGreaterThan(before.updatedAt.getTime());
			expect(after.expiresAt.getTime()).toBeGreaterThan(before.expiresAt.getTime());

			const expectedMin = touchedAt.plus({
				days: 3,
			});
			const diff = Math.abs(after.expiresAt.getTime() - expectedMin.toJSDate().getTime());

			expect(diff).toBeLessThan(5_000);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
