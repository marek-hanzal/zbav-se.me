import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { transactionCollectionFx } from "~/seller/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/seller/transaction/server/fx/transactionCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";

describe("seller transactionCollectionFx", () => {
	it("filters by activity state and statusIn within seller scope", async () => {
		const database = await testabase("seller-transactionCollection-active-statusIn");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const listing = yield* getDefaultListingCreateFx;

			const activeScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const archivedScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const openScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});

			yield* activityArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					type: "buyer-message",
					reference: archivedScenario.transactionId,
				},
			});
			yield* transactionAcceptFx({
				transactionId: openScenario.transactionId,
				userId: seller.id,
			});

			const activeOnly = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					activity: "unread",
				},
			});
			const inactiveOnly = yield* transactionCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					activity: "archived",
					statusIn: [
						"interest",
						"trade",
					],
				},
			});
			const statusCount = yield* transactionCountFx({
				scope: {
					userId: seller.id,
				},
				where: {
					statusIn: [
						"interest",
						"trade",
					],
				},
			});

			expect(activeOnly.map((item) => item.id).sort()).toEqual(
				[
					activeScenario.transactionId,
				].sort(),
			);
			expect(inactiveOnly.map((item) => item.id).sort()).toEqual(
				[
					archivedScenario.transactionId,
					openScenario.transactionId,
				].sort(),
			);
			expect(statusCount).toBe(3);
			expect(typeof activeOnly[0]?.unread).toBe("number");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
