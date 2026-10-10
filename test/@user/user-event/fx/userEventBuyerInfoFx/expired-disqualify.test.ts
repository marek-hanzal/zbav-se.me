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
	it("Expired: buyer action after seller ping disqualifies from expired", async () => {
		const database = await testabaseFn("userEventBuyerInfoFx-expired-disqualify");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			const buyerId = buyer.id;
			const base = DateTime.now().minus({
				days: 25,
			});
			const t1Create = base;
			const t1Open = t1Create.plus({
				hours: 1,
			});
			const t1BuyerMsg = t1Open.plus({
				minutes: 10,
			});
			const t1Expired = t1BuyerMsg.plus({
				days: 5,
			});
			const t2Create = base.plus({
				days: 1,
			});
			const t2Open = t2Create.plus({
				hours: 1,
			});
			const t2Expired = t2Open.plus({
				days: 5,
			});

			// tx-1
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t1Create,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t1Open,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t1BuyerMsg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t1Expired,
				}),
			);

			// tx-2
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t2Create,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t2Open,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t2Expired,
				}),
			);

			const result = yield* userEventBuyerInfoFx({
				userId: buyerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.expired.total).toBe(2);
			expect(result.expired.expired).toBe(1);
			expect(result.expired.percent).toBe(50);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
