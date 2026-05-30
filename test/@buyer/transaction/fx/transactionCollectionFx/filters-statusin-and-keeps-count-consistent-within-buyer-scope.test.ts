import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionCountFx } from "~/buyer/transaction/server/fx/transactionCountFx";
import { transactionAcceptFx } from "~/seller/transaction/server/fx/transactionAcceptFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { getDefaultListingCreateFx } from "~/test/listing/fx/getDefaultListingCreateFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("buyer transactionCollectionFx", () => {
	it("filters statusIn and keeps count consistent within buyer scope", async () => {
		const database = await testabase("buyer-transactionCollection-statusIn");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* getDefaultListingCreateFx;

			const tradeScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});
			const interestScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				listing,
			});

			yield* transactionAcceptFx({
				transactionId: tradeScenario.transactionId,
				userId: seller.id,
			});
			// interestScenario stays in interest status

			const countByStatus = yield* transactionCountFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					statusIn: [
						"trade",
						"interest",
					],
				},
			});

			const tradeOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					status: "trade",
				},
			});
			const interestOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					status: "interest",
				},
			});

			expect(countByStatus).toBe(2);
			expect(tradeOnly.map((item) => item.id)).toEqual([
				tradeScenario.transactionId,
			]);
			expect(interestOnly.map((item) => item.id)).toEqual([
				interestScenario.transactionId,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
