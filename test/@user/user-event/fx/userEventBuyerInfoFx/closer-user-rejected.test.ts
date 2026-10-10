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
	it("Closer: counts user transaction.rejected when no interaction happened (open is allowed)", async () => {
		const database = await testabaseFn("userEventBuyerInfoFx-closer-user-rejected");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			const buyerId = buyer.id;
			const base = DateTime.now().minus({
				days: 10,
			});
			const t1Create = base;
			const t1Open = t1Create.plus({
				minutes: 10,
			});
			const t1Reject = t1Open.plus({
				minutes: 5,
			});
			const t2Create = base.plus({
				days: 1,
			});
			const t2Open = t2Create.plus({
				minutes: 10,
			});
			const t2Msg = t2Open.plus({
				minutes: 1,
			});
			const t2Reject = t2Msg.plus({
				minutes: 1,
			});

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
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t1Reject,
				}),
			);

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
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t2Msg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t2Reject,
				}),
			);

			const result = yield* userEventBuyerInfoFx({
				userId: buyerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.closer.total).toBe(2);
			expect(result.closer.closed).toBe(1);
			expect(result.closer.percent).toBe(50);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
