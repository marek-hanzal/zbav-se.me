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
	it("Bad behaving seller - rejects without interaction, no reactions, expired transactions", async () => {
		const database = await testabase("userEventSellerInfoFx-bad-behaving-seller");
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
									days: 1,
								}),
								scope: "user",
								event: "transaction.rejected",
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
								event: "transaction.closed",
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
									days: 30,
								}),
								scope: "foreign",
								event: "transaction.expired",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
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
									days: 32,
								}),
								scope: "user",
								event: "transaction.rejected",
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

			expect(result.reaction.total).toBe(4);
			expect(result.reaction.reactions).toBe(2);
			expect(result.reaction.terminal).toBe(1);
			expect(result.reaction.percent).toBe(75);

			expect(result.rejected.total).toBe(4);
			expect(result.rejected.rejected).toBe(2);
			expect(result.rejected.percent).toBe(50);

			expect(result.resolved.total).toBe(4);
			expect(result.resolved.resolved).toBe(0);
			expect(result.resolved.terminal).toBe(3);
			expect(result.resolved.percent).toBe(0);

			expect(result.expired.total).toBe(4);
			expect(result.expired.expired).toBe(1);
			expect(result.expired.percent).toBe(25);

			expect(result.load.bucket).toBe("low");
			expect(result.score.score).toBeLessThan(40);
			expect(result.score.rank).toBeLessThanOrEqual(3);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
