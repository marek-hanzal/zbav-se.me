import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { createTransactionTimeline } from "~/test/user-event/fx/createTransactionTimeline";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventBuyerInfoFx", {
	timeout: 4_000,
}, () => {
	it("Improved buyer - earlier misses are outweighed by recent healthy decisions", async () => {
		const database = await testabase("userEventBuyerInfoFx-improved-buyer");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});
			const now = DateTime.now();

			yield* seedUserEventTimelineFx({
				userId: buyer.id,
				events: [
					...createTransactionTimeline({
						group: "tx-1",
						steps: [
							{
								at: now.minus({
									days: 60,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: now
									.minus({
										days: 60,
									})
									.plus({
										hours: 1,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: now
									.minus({
										days: 60,
									})
									.plus({
										hours: 1,
										minutes: 2,
									}),
								scope: "user",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-2",
						steps: [
							{
								at: now.minus({
									days: 45,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: now
									.minus({
										days: 45,
									})
									.plus({
										hours: 2,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: now.minus({
									days: 38,
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
								at: now.minus({
									days: 8,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: now
									.minus({
										days: 8,
									})
									.plus({
										minutes: 30,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: now
									.minus({
										days: 8,
									})
									.plus({
										minutes: 40,
									}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: now.minus({
									days: 7,
								}),
								scope: "user",
								event: "transaction.success",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-4",
						steps: [
							{
								at: now.minus({
									days: 3,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: now
									.minus({
										days: 3,
									})
									.plus({
										minutes: 5,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: now
									.minus({
										days: 3,
									})
									.plus({
										minutes: 10,
									}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: now.minus({
									days: 2,
								}),
								scope: "user",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
				],
			});

			const result = yield* userEventBuyerInfoFx({
				userId: buyer.id,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.reaction.total).toBe(4);
			expect(result.decision.total).toBe(4);
			expect(result.activity.bucket).toBe("high");
			expect(result.expired.percent).toBeLessThanOrEqual(25);
			expect(result.score.score).toBeGreaterThanOrEqual(65);
			expect(result.score.rank).toBeGreaterThanOrEqual(4);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
