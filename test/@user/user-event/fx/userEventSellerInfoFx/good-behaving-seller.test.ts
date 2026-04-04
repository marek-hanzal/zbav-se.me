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
	it("Good behaving seller - reacts quickly and resolves transactions", async () => {
		const database = await testabase("userEventSellerInfoFx-good-behaving-seller");
		const baseTime = DateTime.now().minus({
			days: 89,
		});

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

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
									days: 10,
									minutes: 30,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 12,
									minutes: 30,
								}),
								scope: "user",
								event: "transaction.resolved",
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
									days: 20,
									hours: 2,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: baseTime.plus({
									days: 21,
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

			expect(result.reaction.total).toBe(3);
			expect(result.reaction.reactions).toBe(3);
			expect(result.reaction.terminal).toBe(0);
			expect(result.reaction.percent).toBe(100);
			expect(result.reaction.medianMs).toBeLessThan(2 * 60 * 60 * 1000);

			expect(result.rejected.total).toBe(3);
			expect(result.rejected.rejected).toBe(0);
			expect(result.rejected.percent).toBe(0);

			expect(result.resolved.total).toBe(3);
			expect(result.resolved.resolved).toBe(3);
			expect(result.resolved.terminal).toBe(0);
			expect(result.resolved.percent).toBe(100);

			expect(result.expired.total).toBe(3);
			expect(result.expired.expired).toBe(0);
			expect(result.expired.percent).toBe(0);

			expect(result.load.bucket).toBe("low");
			expect(result.activity.bucket).toBe("low");
			expect(result.score.score).toBeGreaterThan(80);
			expect(result.score.rank).toBeGreaterThanOrEqual(5);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
