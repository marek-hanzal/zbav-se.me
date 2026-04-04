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
	it("Mixed behavior - combines good reactions, one closer and one ghosted thread", async () => {
		const database = await testabase("userEventBuyerInfoFx-mixed-behavior");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			const base = DateTime.now().minus({
				days: 40,
			});

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
								at: DateTime.now().minus({
									days: 2,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 2,
									})
									.plus({
										minutes: 30,
									}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: DateTime.now()
									.minus({
										days: 2,
									})
									.plus({
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
									days: 4,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 4,
									minutes: 10,
								}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 4,
									hours: 1,
									minutes: 10,
								}),
								scope: "foreign",
								event: "transaction.rejected",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-4",
						steps: [
							{
								at: base.plus({
									days: 6,
								}),
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 6,
									hours: 2,
								}),
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: base.plus({
									days: 9,
									hours: 2,
								}),
								scope: "foreign",
								event: "transaction.expired",
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

			expect(result.reaction.percent).toBe(75);
			expect(result.closer.closed).toBe(1);
			expect(result.decision.percent).toBe(75);
			expect(result.expired.expired).toBe(1);
			expect(result.load.bucket).toBe("low");
			expect(result.activity.bucket).toBe("high");
			expect(result.score.score).toBeGreaterThanOrEqual(40);
			expect(result.score.score).toBeLessThan(85);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
