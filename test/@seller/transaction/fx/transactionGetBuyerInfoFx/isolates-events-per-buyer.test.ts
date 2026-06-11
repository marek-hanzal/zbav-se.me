import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFx } from "@/lib/common/date";
import { transactionGetBuyerInfoFx } from "~/seller/transaction/server/fx/transactionGetBuyerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("transactionGetBuyerInfoFx", () => {
	it("returns buyer events only for the buyer behind the requested transaction", async () => {
		const database = await testabase("transactionGetBuyerInfoFx-event-isolation");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyerA = yield* leaseTestUserFx({});
			const buyerB = yield* leaseTestUserFx({});

			const scenarioA = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyerA.id,
			});
			const scenarioB = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyerB.id,
			});

			const transactionA = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", scenarioA.listingId)
					.where("userId", "=", buyerA.id)
					.executeTakeFirstOrThrow(),
			);
			const transactionB = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", scenarioB.listingId)
					.where("userId", "=", buyerB.id)
					.executeTakeFirstOrThrow(),
			);

			yield* userEventCreateFx({
				userId: buyerA.id,
				scope: "user",
				source: "transaction",
				group: "buyer-info-a-group",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFx({
					now: () =>
						DateTime.now().minus({
							days: 10,
						}),
				}),
			);
			yield* userEventCreateFx({
				userId: buyerA.id,
				scope: "user",
				source: "transaction",
				group: "buyer-info-a-group",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				withDateServiceFx({
					now: () =>
						DateTime.now().minus({
							days: 9,
						}),
				}),
			);
			yield* userEventCreateFx({
				userId: buyerA.id,
				scope: "user",
				source: "transaction",
				group: "buyer-info-a-group-extra-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFx({
					now: () =>
						DateTime.now().minus({
							days: 7,
						}),
				}),
			);
			yield* userEventCreateFx({
				userId: buyerA.id,
				scope: "user",
				source: "transaction",
				group: "buyer-info-a-group-extra-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFx({
					now: () =>
						DateTime.now().minus({
							days: 6,
						}),
				}),
			);

			yield* userEventCreateFx({
				userId: buyerB.id,
				scope: "user",
				source: "transaction",
				group: "buyer-info-b-group",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFx({
					now: () =>
						DateTime.now().minus({
							days: 8,
						}),
				}),
			);

			const buyerAInfo = yield* transactionGetBuyerInfoFx({
				userId: seller.id,
				transactionId: transactionA.id,
			});
			const buyerBInfo = yield* transactionGetBuyerInfoFx({
				userId: seller.id,
				transactionId: transactionB.id,
			});

			expect(buyerAInfo.events).not.toBeNull();
			expect(buyerBInfo.events).not.toBeNull();
			expect(buyerAInfo.events?.reaction.total ?? 0).toBeGreaterThan(
				buyerBInfo.events?.reaction.total ?? 0,
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
