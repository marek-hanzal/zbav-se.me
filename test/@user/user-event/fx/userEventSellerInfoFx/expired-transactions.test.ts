import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { createTransactionTimeline } from "~/test/user-event/fx/createTransactionTimeline";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventSellerInfoFx", {
	timeout: 4_000,
}, () => {
	it("Expired transactions - buyer pings, seller doesn't act, transaction expires", async () => {
		const database = await testabase("userEventSellerInfoFx-expired-transactions");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const baseTime = DateTime.now().minus({
				days: 89,
			});

			yield* seedUserEventTimelineFx({
				userId: seller.id,
				events: [
					...createTransactionTimeline({
						group: "tx-1",
						steps: [
							{
								at: baseTime,
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 10,
								}),
								scope: "foreign",
								event: "transaction.expired",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-2",
						steps: [
							{
								at: baseTime.plus({
									days: 10,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 15,
								}),
								scope: "foreign",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 20,
								}),
								scope: "foreign",
								event: "transaction.expired",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-3",
						steps: [
							{
								at: baseTime.plus({
									days: 20,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 22,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 27,
								}),
								scope: "foreign",
								event: "transaction.expired",
								isTerminal: true,
							},
						],
					}),
				],
			});

			const result = yield* userEventSellerInfoFx({
				userId: seller.id,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.expired.total).toBe(3);
			expect(result.expired.expired).toBe(2);
			expect(result.expired.percent).toBeCloseTo(66.67, 1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
