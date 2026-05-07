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
	it("Seller rejects after interaction - should not count as rejected without interaction", async () => {
		const database = await testabase("userEventSellerInfoFx-reject-with-interaction");

		// Base time: 89 days ago (within 90 day cutoff)
		const baseTime = DateTime.now().minus({
			days: 89,
		});

		// Transaction 1: Seller messages then rejects (should be dirty)
		const t1Create = baseTime;
		const t1Message = t1Create.plus({
			hours: 1,
		});
		const t1Reject = t1Message.plus({
			days: 1,
		});

		// Transaction 2: Seller opens then rejects (should be dirty)
		const t2Create = baseTime.plus({
			days: 10,
		});
		const t2Open = t2Create.plus({
			hours: 2,
		});
		const t2Reject = t2Open.plus({
			days: 2,
		});

		// Transaction 3: Seller rejects without interaction (should count)
		const t3Create = baseTime.plus({
			days: 20,
		});
		const t3Reject = t3Create.plus({
			days: 1,
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
								at: t1Create,
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: t1Message,
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: t1Reject,
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
								at: t2Create,
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: t2Open,
								scope: "user",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: t2Reject,
								scope: "user",
								event: "transaction.rejected",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-3",
						steps: [
							{
								at: t3Create,
								scope: "foreign",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: t3Reject,
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

			// Rejected: Only t3 should count (rejected without interaction)
			// t1 and t2 have interactions before reject, so they're dirty
			expect(result.rejected.total).toBe(3);
			expect(result.rejected.rejected).toBe(1); // Only t3
			expect(result.rejected.percent).toBeCloseTo(33.33, 1);

			// All three should have reactions (all rejected, which counts as reaction)
			expect(result.reaction.total).toBe(3);
			expect(result.reaction.reactions).toBe(3); // All three have reactions (reject events)
			expect(result.reaction.terminal).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
