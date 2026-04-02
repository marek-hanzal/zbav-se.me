import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUserFx } from "~/test/user/fx/createUserFx";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventSellerInfoFx", () => {
	it("Mixed behavior - combo of good and bad seller behaviors", async () => {
		const database = await testabase("userEventSellerInfoFx-mixed-behavior");

		const { api } = auth(() => {
			return database.dialect;
		});

		// Base time: 89 days ago (within 90 day cutoff)
		const baseTime = DateTime.now().minus({
			days: 89,
		});

		// Transaction 1: Good - quick reaction and resolve
		const t1Create = baseTime;
		const t1React = t1Create.plus({
			hours: 1,
		});
		const t1Resolve = t1React.plus({
			days: 1,
		});

		// Transaction 2: Bad - reject without interaction
		const t2Create = baseTime.plus({
			days: 10,
		});
		const t2Reject = t2Create.plus({
			days: 1,
		});

		// Transaction 3: Good - quick reaction, resolves
		const t3Create = baseTime.plus({
			days: 20,
		});
		const t3React = t3Create.plus({
			minutes: 45,
		});
		const t3Resolve = t3React.plus({
			days: 2,
		});

		// Transaction 4: Bad - buyer ends before seller reacts
		const t4Create = baseTime.plus({
			days: 30,
		});
		const t4BuyerEnd = t4Create.plus({
			days: 3,
		});

		// Transaction 5: Bad - reject without interaction
		const t5Create = baseTime.plus({
			days: 40,
		});
		const t5Reject = t5Create.plus({
			days: 2,
		});

		// Transaction 6: Good - reaction and resolve
		const t6Create = baseTime.plus({
			days: 50,
		});
		const t6React = t6Create.plus({
			hours: 2,
		});
		const t6Resolve = t6React.plus({
			days: 1,
		});

		return Effect.gen(function* () {
			const seller = yield* createUserFx({
				api,
				email: "seller@test.cz",
				name: "Seller",
			});

			const sellerId = seller.id;
			yield* seedUserEventTimelineFx({
				userId: sellerId,
				events: [
					{
						at: t1Create,
						group: "tx-1",
						scope: "foreign",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: t1React,
						group: "tx-1",
						scope: "user",
						source: "transaction",
						event: "transaction.open",
						isTerminal: false,
					},
					{
						at: t1Resolve,
						group: "tx-1",
						scope: "user",
						source: "transaction",
						event: "transaction.resolved",
						isTerminal: true,
					},
					{
						at: t2Create,
						group: "tx-2",
						scope: "foreign",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: t2Reject,
						group: "tx-2",
						scope: "user",
						source: "transaction",
						event: "transaction.rejected",
						isTerminal: true,
					},
					{
						at: t3Create,
						group: "tx-3",
						scope: "foreign",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: t3React,
						group: "tx-3",
						scope: "user",
						source: "transaction",
						event: "transaction.message",
						isTerminal: false,
					},
					{
						at: t3Resolve,
						group: "tx-3",
						scope: "user",
						source: "transaction",
						event: "transaction.resolved",
						isTerminal: true,
					},
					{
						at: t4Create,
						group: "tx-4",
						scope: "foreign",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: t4BuyerEnd,
						group: "tx-4",
						scope: "foreign",
						source: "transaction",
						event: "transaction.closed",
						isTerminal: true,
					},
					{
						at: t5Create,
						group: "tx-5",
						scope: "foreign",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: t5Reject,
						group: "tx-5",
						scope: "user",
						source: "transaction",
						event: "transaction.rejected",
						isTerminal: true,
					},
					{
						at: t6Create,
						group: "tx-6",
						scope: "foreign",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: t6React,
						group: "tx-6",
						scope: "user",
						source: "transaction",
						event: "transaction.open",
						isTerminal: false,
					},
					{
						at: t6Resolve,
						group: "tx-6",
						scope: "user",
						source: "transaction",
						event: "transaction.resolved",
						isTerminal: true,
					},
				],
			});

			const result = yield* userEventSellerInfoFx({
				userId: sellerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			// Reaction: 3 good reactions, 1 terminal, 2 rejects (count as reactions)
			expect(result.reaction.total).toBe(6);
			expect(result.reaction.reactions).toBe(5); // t1, t2 (reject), t3, t5 (reject), t6
			expect(result.reaction.terminal).toBe(1); // t4
			expect(result.reaction.percent).toBe(100); // 5 + 1 = 6 out of 6

			// Rejected: 2 rejects without interaction
			expect(result.rejected.total).toBe(6);
			expect(result.rejected.rejected).toBe(2); // t2, t5
			expect(result.rejected.percent).toBeCloseTo(33.33, 1);

			// Resolved: 3 resolved
			expect(result.resolved.total).toBe(6);
			expect(result.resolved.resolved).toBe(3); // t1, t3, t6
			expect(result.resolved.terminal).toBe(3); // t2, t4, t5
			expect(result.resolved.percent).toBe(50);

			// Expired: 0 expired
			expect(result.expired.total).toBe(6);
			expect(result.expired.expired).toBe(0);
			expect(result.expired.percent).toBe(0);

			// Load: No active transactions
			expect(result.load.bucket).toBe("low");

			// Score: Should be moderate (40-70)
			expect(result.score.score).toBeGreaterThanOrEqual(40);
			expect(result.score.score).toBeLessThan(80);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
