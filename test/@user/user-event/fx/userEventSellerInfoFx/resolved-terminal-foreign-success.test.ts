import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer-user-event/fx/userEventSellerInfoFx";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user-event/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Resolved: counts foreign transaction.success as buyer-terminal for seller resolve", async () => {
		const database = await testabaseFn(
			"userEventSellerInfoFx-resolved-terminal-foreign-success",
		);
		const base = DateTime.now().minus({
			days: 20,
		});

		// tx-1: buyer ends as success -> terminal++
		const t1Create = base;
		const t1BuyerSuccess = t1Create.plus({
			days: 2,
		});

		// tx-2: seller resolves explicitly -> resolved++
		const t2Create = base.plus({
			days: 1,
		});
		const t2SellerResolve = t2Create.plus({
			days: 3,
		});

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const sellerId = seller.id;

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
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
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.success",
				isTerminal: true,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t1BuyerSuccess,
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
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
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				withDateServiceFn({
					nowFn: () => t2SellerResolve,
				}),
			);

			const result = yield* userEventSellerInfoFx({
				userId: sellerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.resolved.total).toBe(2);
			expect(result.resolved.resolved).toBe(1);
			expect(result.resolved.terminal).toBe(1);
			expect(result.resolved.percent).toBe(50);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
