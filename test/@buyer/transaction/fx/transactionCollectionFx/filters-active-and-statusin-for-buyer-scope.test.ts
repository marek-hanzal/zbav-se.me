import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/buyer/transaction/server/fx/transactionCountFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller/transaction/server/fx/transactionResolveFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { inboxArchiveFx } from "~/user/inbox/server/fx/inboxArchiveFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";

describe("buyer transactionCollectionFx", () => {
	it("filters by active inbox state and statusIn within buyer scope", async () => {
		const database = await testabase("buyer-transactionCollection-active-statusIn");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({
				api,
				slug: "buyer-transaction-collection-direct",
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
			const terminalScenario = yield* createPendingScenarioFx({
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
			yield* transactionAcceptFx({
				transactionId: terminalScenario.transactionId,
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
			yield* transactionResolveFx({
				transactionId: terminalScenario.transactionId,
				userId: seller.id,
			});
			yield* transactionSuccessFx({
				transactionId: terminalScenario.transactionId,
				userId: buyer.id,
			});
			yield* inboxArchiveFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					type: "seller-message",
					reference: terminalScenario.transactionId,
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

			expect(activeOnly.map((item) => item.id)).toEqual([
				activeScenario.transactionId,
			]);
			expect(inactiveOnly.map((item) => item.id).sort()).toEqual(
				[
					passiveScenario.transactionId,
					terminalScenario.transactionId,
				].sort(),
			);
			expect(statusCount.where).toBe(3);
			expect(typeof activeOnly[0]?.unreadCount).toBe("number");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
