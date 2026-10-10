import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { transactionPatchFx } from "~/seller-transaction/fx/transactionPatchFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

const atFx = <A, E, R>(iso: string, eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		withDateServiceFn({
			nowFn: () => DateTime.fromISO(iso),
		}),
	);

describe("transactionPatchFx", () => {
	it("patches a scoped seller transaction and refreshes updatedAt and expiresAt from the current time", async () => {
		const database = await testabaseFn("transactionPatchFx-scoped-success");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const scenario = yield* atFx(
				"2026-05-02T10:00:00.000Z",
				createOpenScenarioFx({
					sellerId: seller.id,
					buyerId: buyer.id,
				}),
			);

			const before = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", scenario.transactionId)
					.executeTakeFirstOrThrow(),
			);

			const patched = yield* atFx(
				"2026-05-05T15:30:00.000Z",
				transactionPatchFx({
					userId: seller.id,
					patch: {
						status: "resolved",
					},
					query: {
						where: {
							id: scenario.transactionId,
						},
					},
					scope: {
						userId: seller.id,
					},
				}),
			);

			const after = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"status",
						"updatedAt",
						"expiresAt",
					])
					.where("id", "=", scenario.transactionId)
					.executeTakeFirstOrThrow(),
			);

			expect(before.status).toBe("trade");
			expect(patched.id).toBe(scenario.transactionId);
			expect(patched.status).toBe("resolved");
			expect(after.status).toBe("resolved");
			expect(after.updatedAt.toISOString()).toBe("2026-05-05T15:30:00.000Z");
			expect(after.expiresAt.toISOString()).toBe("2026-05-08T15:30:00.000Z");
			expect(after.updatedAt.getTime()).toBeGreaterThan(before.updatedAt.getTime());
			expect(after.expiresAt.getTime()).toBeGreaterThan(before.expiresAt.getTime());
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
