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
	it("Good behaving buyer - reacts after open, negotiates, and marks success", async () => {
		const database = await testabase("userEventBuyerInfoFx-good-behaving-buyer");
		const base = DateTime.now().minus({
			days: 60,
		});

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			yield* seedUserEventTimelineFx({
				userId: buyer.id,
				events: [
					...createTransactionTimeline({
						group: "tx-1",
						steps: [
							{
								at: base,
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									hours: 1,
								}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									hours: 1,
									minutes: 10,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 1,
									hours: 1,
									minutes: 10,
								}),
								scope: "user",
								event: "transaction.success",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-2",
						steps: [
							{
								at: base.plus({
									days: 30,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 30,
									minutes: 30,
								}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 30,
									minutes: 45,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 32,
									minutes: 45,
								}),
								scope: "user",
								event: "transaction.success",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-3",
						steps: [
							{
								at: base.plus({
									days: 58,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 58,
									minutes: 5,
								}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 58,
									minutes: 10,
								}),
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 59,
								}),
								scope: "user",
								event: "transaction.success",
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

			expect(result.reaction.total).toBe(3);
			expect(result.reaction.reactions).toBe(3);
			expect(result.reaction.terminal).toBe(0);
			expect(result.reaction.percent).toBe(100);
			expect(result.reaction.medianMs).toBeLessThanOrEqual(30 * 60 * 1000);
			expect(result.closer.total).toBe(3);
			expect(result.closer.closed).toBe(0);
			expect(result.closer.percent).toBe(0);
			expect(result.decision.total).toBe(3);
			expect(result.decision.decisions).toBe(3);
			expect(result.decision.terminal).toBe(0);
			expect(result.decision.percent).toBe(100);
			expect(result.expired.total).toBe(3);
			expect(result.expired.expired).toBe(0);
			expect(result.expired.percent).toBe(0);
			expect(result.load.bucket).toBe("low");
			expect(result.activity.bucket).toBe("high");
			expect(result.score.score).toBeGreaterThanOrEqual(80);
			expect(result.score.rank).toBeGreaterThanOrEqual(5);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
