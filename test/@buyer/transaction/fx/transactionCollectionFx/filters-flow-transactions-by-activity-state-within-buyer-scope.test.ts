import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("buyer transactionCollectionFx", () => {
	it("filters flow transactions by activity state within buyer scope", async () => {
		const database = await testabase("buyer-transactionCollection-active");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* getDefaultListingCreateFx;

			const activeScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const passiveScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});

			yield* transactionAcceptFx({
				transactionId: activeScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionAcceptFx({
				transactionId: passiveScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId: activeScenario.transactionId,
				kind: "text",
				payload: {
					text: "Seller ping",
				},
			});
			yield* activityArchiveFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					type: "seller-message",
					reference: passiveScenario.transactionId,
				},
			});

			const activeOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "seller-to-buyer",
				},
			});
			const inactiveOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "buyer-to-seller",
				},
			});

			expect(activeOnly.map((item) => item.id)).toEqual([
				activeScenario.transactionId,
			]);
			expect(inactiveOnly.map((item) => item.id)).toEqual([
				passiveScenario.transactionId,
			]);
			expect(typeof activeOnly[0]?.unread).toBe("number");
			expect(activeOnly[0]?.unread).toBe(2);
			expect(inactiveOnly[0]?.unread).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
