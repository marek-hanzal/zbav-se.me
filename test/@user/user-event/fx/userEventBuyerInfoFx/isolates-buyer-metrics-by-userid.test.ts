import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { userEventBuyerInfoFx } from "~/seller-user-event/fx/userEventBuyerInfoFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user-event/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("isolates buyer metrics by userId and does not mix other buyers' events", async () => {
		const database = await testabaseFn("userEventBuyerInfoFx-isolation");

		return Effect.gen(function* () {
			const buyerA = yield* leaseTestUserFx({});
			const buyerB = yield* leaseTestUserFx({});

			yield* userEventCreateFx({
				userId: buyerA.id,
				scope: "user",
				source: "transaction",
				group: "buyer-a-group",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () =>
						DateTime.now().minus({
							days: 10,
						}),
				}),
			);
			yield* userEventCreateFx({
				userId: buyerA.id,
				scope: "user",
				source: "transaction",
				group: "buyer-a-group",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () =>
						DateTime.now().minus({
							days: 9,
						}),
				}),
			);

			yield* userEventCreateFx({
				userId: buyerB.id,
				scope: "user",
				source: "transaction",
				group: "buyer-b-group",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () =>
						DateTime.now().minus({
							days: 8,
						}),
				}),
			);

			const buyerAInfo = yield* userEventBuyerInfoFx({
				userId: buyerA.id,
			});
			const buyerBInfo = yield* userEventBuyerInfoFx({
				userId: buyerB.id,
			});

			expect(buyerAInfo).not.toBeNull();
			expect(buyerAInfo?.reaction.total).toBe(1);
			expect(buyerBInfo).toBeNull();
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
