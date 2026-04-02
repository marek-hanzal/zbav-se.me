import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/buyer/transaction/server/fx/transactionCountFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("buyer transactionCollectionFx", () => {
	it("filters active transactions by inbox state within buyer scope", async () => {
		const database = await testabase("buyer-transactionCollection-active");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "buyer-transaction-collection-seller@test.cz",
				name: "Buyer Transaction Collection Seller",
			});
			const buyer = yield* createDbUserFx({
				email: "buyer-transaction-collection-buyer@test.cz",
				name: "Buyer Transaction Collection Buyer",
			});
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
			yield* inboxArchiveFx({
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
					active: true,
				},
			});
			const inactiveOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					active: false,
				},
			});

			expect(activeOnly.map((item) => item.id)).toEqual([
				activeScenario.transactionId,
			]);
			expect(inactiveOnly.map((item) => item.id)).toEqual([
				passiveScenario.transactionId,
			]);
			expect(typeof activeOnly[0]?.unreadCount).toBe("number");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("filters statusIn and keeps count consistent within buyer scope", async () => {
		const database = await testabase("buyer-transactionCollection-statusIn");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "buyer-transaction-status-seller@test.cz",
				name: "Buyer Transaction Status Seller",
			});
			const buyer = yield* createDbUserFx({
				email: "buyer-transaction-status-buyer@test.cz",
				name: "Buyer Transaction Status Buyer",
			});
			const listing = yield* getDefaultListingCreateFx;

			const openScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const successScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			yield* transactionAcceptFx({
				transactionId: openScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionAcceptFx({
				transactionId: successScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId: openScenario.transactionId,
				kind: "text",
				payload: {
					text: "Open seller ping",
				},
			});
			yield* transactionEntryCreateFx({
				userId: seller.id,
				transactionId: successScenario.transactionId,
				kind: "text",
				payload: {
					text: "Success seller ping",
				},
			});
			yield* transactionResolveFx({
				transactionId: successScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionSuccessFx({
				transactionId: successScenario.transactionId,
				userId: buyer.id,
			});
			yield* inboxArchiveFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					type: "seller-message",
					reference: openScenario.transactionId,
				},
			});
			yield* inboxArchiveFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					type: "seller-message",
					reference: successScenario.transactionId,
				},
			});

			const inactiveOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					active: false,
					statusIn: [
						"open",
						"success",
					],
				},
			});
			const statusCount = yield* transactionCountFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					statusIn: [
						"open",
						"success",
					],
				},
			});

			expect(inactiveOnly.map((item) => item.id).sort()).toEqual(
				[
					openScenario.transactionId,
					successScenario.transactionId,
				].sort(),
			);
			expect(statusCount.where).toBe(2);
			expect(inactiveOnly.every((item) => typeof item.unreadCount === "number")).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
