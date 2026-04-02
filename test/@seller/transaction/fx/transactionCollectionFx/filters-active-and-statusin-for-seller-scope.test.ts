import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/seller/transaction/server/fx/transactionCountFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";

describe("seller transactionCollectionFx", () => {
	it("filters by active inbox state and statusIn within seller scope", async () => {
		const database = await testabase("seller-transactionCollection-active-statusIn");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({
				api,
				slug: "seller-transaction-collection-direct",
			});

			const activeScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const archivedScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const openScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const activeTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", activeScenario.listingId)
					.executeTakeFirstOrThrow(),
			);
			const archivedTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", archivedScenario.listingId)
					.executeTakeFirstOrThrow(),
			);
			const openTx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", openScenario.listingId)
					.executeTakeFirstOrThrow(),
			);

			yield* inboxArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					type: "buyer-message",
					reference: archivedTx.id,
				},
			});
			yield* transactionAcceptFx({
				transactionId: openTx.id,
				userId: seller.id,
			});

			const activeOnly = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					active: true,
				},
			});
			const inactiveOnly = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					active: false,
					statusIn: [
						"pending",
						"open",
					],
				},
			});
			const statusCount = yield* transactionCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					statusIn: [
						"pending",
						"open",
					],
				},
			});

			expect(activeOnly.map((item) => item.id).sort()).toEqual(
				[
					activeTx.id,
					openTx.id,
				].sort(),
			);
			expect(inactiveOnly.map((item) => item.id).sort()).toEqual([
				archivedTx.id,
			]);
			expect(statusCount.where).toBe(3);
			expect(typeof activeOnly[0]?.unreadCount).toBe("number");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
