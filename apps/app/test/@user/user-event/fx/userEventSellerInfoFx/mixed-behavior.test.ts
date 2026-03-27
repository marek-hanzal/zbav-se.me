import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Mixed behavior - combo of good and bad seller behaviors", async () => {
		const database = await testabase("userEventSellerInfoFx-mixed-behavior");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;

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

		const result = await Effect.gen(function* () {
			// Transaction 1: Good
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t1Create;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t1React;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t1Resolve;
					},
				}),
			);

			// Transaction 2: Bad - reject without interaction
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t2Create;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t2Reject;
					},
				}),
			);

			// Transaction 3: Good
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t3Create;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t3React;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t3Resolve;
					},
				}),
			);

			// Transaction 4: Bad - buyer ends
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-4",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t4Create;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-4",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t4BuyerEnd;
					},
				}),
			);

			// Transaction 5: Bad - reject without interaction
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-5",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t5Create;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-5",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t5Reject;
					},
				}),
			);

			// Transaction 6: Good
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-6",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t6Create;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-6",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t6React;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-6",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t6Resolve;
					},
				}),
			);

			return yield* userEventSellerInfoFx({
				userId: sellerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

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
	});
});
