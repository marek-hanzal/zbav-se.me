import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { transactionPatchFx } from "~/buyer/transaction/server/fx/transactionPatchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("transactionPatchFx", () => {
	it("patches transaction data and refreshes updatedAt and expiresAt", async () => {
		const database = await testabase("buyerTransactionPatchFx-refreshes-timestamps");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			const scenario = yield* createPendingScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
			});

			const before = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select([
						"id",
						"status",
						"updatedAt",
						"expiresAt",
					])
					.where("listingId", "=", scenario.listingId)
					.executeTakeFirstOrThrow(),
			);

			const fixedNow = DateTime.fromISO("2026-04-02T12:00:00.000Z");

			const patched = yield* transactionPatchFx({
				userId: users.buyer.id,
				patch: {
					status: "success",
				},
				query: {
					where: {
						id: before.id,
					},
				},
				scope: {
					userId: users.buyer.id,
				},
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => fixedNow,
				}),
			);

			expect(patched.status).toBe("success");
			expect(patched.updatedAt.toISOString()).toBe(fixedNow.toUTC().toISO());
			expect(patched.expiresAt.toISOString()).toBe(
				fixedNow
					.plus({
						days: 3,
					})
					.toUTC()
					.toISO(),
			);
			expect(patched.updatedAt.getTime()).not.toBe(before.updatedAt.getTime());
			expect(patched.expiresAt.getTime()).not.toBe(before.expiresAt.getTime());
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
