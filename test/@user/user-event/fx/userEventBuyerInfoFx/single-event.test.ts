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
	it("Single event returns nothing", async () => {
		const database = await testabaseFn("userEventBuyerInfoFx-single-event");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			yield* userEventCreateFx({
				userId: buyer.id,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn() {
						return DateTime.now().minus({
							days: 10,
						});
					},
				}),
			);

			const result = yield* userEventBuyerInfoFx({
				userId: buyer.id,
			});

			expect(result).toBeNull();
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
