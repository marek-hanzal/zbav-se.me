import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer-user-event/fx/userEventSellerInfoFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { createTransactionTimelineFn } from "~/test/user-event/fx/createTransactionTimelineFn";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventSellerInfoFx", {
	timeout: 4_000,
}, () => {
	it("Mixed behavior - good resolutions are dragged down by direct rejects and buyer-led endings", async () => {
		const database = await testabaseFn("userEventSellerInfoFx-mixed-behavior");
		const baseTime = DateTime.now().minus({
			days: 89,
		});

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			yield* seedUserEventTimelineFx({
				userId: seller.id,
				events: [
					...createTransactionTimelineFn({
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
									hours: 1,
								}),
								scope: "user",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 1,
									hours: 1,
								}),
								scope: "user",
								event: "transaction.resolved",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFn({
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
									days: 11,
								}),
								scope: "user",
								event: "transaction.rejected",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFn({
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
									days: 20,
									minutes: 45,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 22,
									minutes: 45,
								}),
								scope: "user",
								event: "transaction.resolved",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFn({
						group: "tx-4",
						steps: [
							{
								at: baseTime.plus({
									days: 30,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 33,
								}),
								scope: "foreign",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFn({
						group: "tx-5",
						steps: [
							{
								at: baseTime.plus({
									days: 40,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 42,
								}),
								scope: "user",
								event: "transaction.rejected",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFn({
						group: "tx-6",
						steps: [
							{
								at: baseTime.plus({
									days: 50,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 50,
									hours: 2,
								}),
								scope: "user",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 51,
									hours: 2,
								}),
								scope: "user",
								event: "transaction.resolved",
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

			expect(result.reaction.percent).toBe(100);
			expect(result.rejected.rejected).toBe(2);
			expect(result.resolved.percent).toBe(50);
			expect(result.expired.expired).toBe(0);
			expect(result.load.bucket).toBe("low");
			expect(result.score.score).toBeGreaterThanOrEqual(40);
			expect(result.score.score).toBeLessThan(80);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
