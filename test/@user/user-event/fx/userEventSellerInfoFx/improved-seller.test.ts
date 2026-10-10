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
	it("Improved seller - old rejects are outweighed by recent quick resolutions", async () => {
		const database = await testabaseFn("userEventSellerInfoFx-improved-seller");
		const base = DateTime.now().minus({
			days: 80,
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
								at: base,
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 1,
								}),
								scope: "user",
								event: "transaction.rejected",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFn({
						group: "tx-2",
						steps: [
							{
								at: base.plus({
									days: 40,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 40,
									hours: 1,
								}),
								scope: "user",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 41,
									hours: 1,
								}),
								scope: "user",
								event: "transaction.resolved",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFn({
						group: "tx-3",
						steps: [
							{
								at: base.plus({
									days: 60,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 60,
									minutes: 30,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 62,
									minutes: 30,
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
								at: base.plus({
									days: 75,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 75,
									minutes: 15,
								}),
								scope: "user",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 76,
								}),
								scope: "user",
								event: "transaction.resolved",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimelineFn({
						group: "tx-5",
						steps: [
							{
								at: base.plus({
									days: 79,
								}),
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 79,
									hours: 2,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 80,
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
			expect(result.rejected.percent).toBe(20);
			expect(result.resolved.resolved).toBe(4);
			expect(result.activity.bucket).toBe("high");
			expect(result.score.score).toBeGreaterThanOrEqual(70);
			expect(result.score.rank).toBeGreaterThanOrEqual(5);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
