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
	it("Bad behaving buyer - instant closes, ghosts after open, and lets transactions expire", async () => {
		const database = await testabase("userEventBuyerInfoFx-bad-behaving-buyer");
		const base = DateTime.now().minus({
			days: 50,
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
									hours: 2,
								}),
								scope: "foreign",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-2",
						steps: [
							{
								at: base.plus({
									days: 5,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 5,
									minutes: 30,
								}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 5,
									minutes: 35,
								}),
								scope: "user",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-3",
						steps: [
							{
								at: base.plus({
									days: 10,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 10,
									hours: 2,
								}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 17,
									hours: 2,
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
								at: base.plus({
									days: 15,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 15,
									minutes: 10,
								}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 15,
									minutes: 11,
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
			expect(result.reaction.reactions).toBe(2);
			expect(result.reaction.terminal).toBe(1);
			expect(result.reaction.percent).toBe(75);
			expect(result.closer.total).toBe(4);
			expect(result.closer.closed).toBe(2);
			expect(result.closer.percent).toBe(50);
			expect(result.decision.total).toBe(4);
			expect(result.decision.decisions).toBe(2);
			expect(result.decision.terminal).toBe(1);
			expect(result.decision.percent).toBe(75);
			expect(result.expired.total).toBe(4);
			expect(result.expired.expired).toBe(1);
			expect(result.expired.percent).toBe(25);
			expect(result.score.score).toBeLessThan(60);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
