import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/buyer/transaction/server/fx/transactionCloseFx";
import { transactionCollectionFx } from "~/buyer/transaction/server/fx/transactionCollectionFx";
import { transactionDisputeFx } from "~/buyer/transaction/server/fx/transactionDisputeFx";
import { transactionRejectFx } from "~/buyer/transaction/server/fx/transactionRejectFx";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("buyer transaction read model activity and sort", () => {
	it("sorts by status rank and archived flow returns only terminal buyer-side states", async () => {
		const database = await testabase("buyer-transaction-read-model-status-sort");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const interestScenario = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const tradeScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			const disputeScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionDisputeFx({
				transactionId: disputeScenario.transactionId,
				userId: buyer.id,
			});
			const rejectedScenario = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionRejectFx({
				transactionId: rejectedScenario.transactionId,
				userId: buyer.id,
			});
			const successScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionSuccessFx({
				transactionId: successScenario.transactionId,
				userId: buyer.id,
			});
			const closedScenario = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});
			yield* transactionCloseFx({
				transactionId: closedScenario.transactionId,
				userId: buyer.id,
			});

			const statusAsc = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				sort: [
					{
						field: "status",
						order: "asc",
					},
				],
			});
			const archivedOnly = yield* transactionCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					flow: "archived",
				},
				sort: [
					{
						field: "status",
						order: "asc",
					},
				],
			});

			expect(statusAsc.map((item) => item.id)).toEqual([
				interestScenario.transactionId,
				tradeScenario.transactionId,
				disputeScenario.transactionId,
				rejectedScenario.transactionId,
				successScenario.transactionId,
				closedScenario.transactionId,
			]);
			expect(archivedOnly.map((item) => item.id)).toEqual([
				rejectedScenario.transactionId,
				successScenario.transactionId,
				closedScenario.transactionId,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
