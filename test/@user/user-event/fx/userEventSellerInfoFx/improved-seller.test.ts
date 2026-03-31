import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Improved seller - bad behavior early, good behavior recently", async () => {
		const database = await testabase("userEventSellerInfoFx-improved-seller");

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

		// Recent transactions (good behavior) - within last 90 days
		// Transaction 1 (80 days ago): Bad - reject without interaction
		const t1Create = DateTime.now().minus({
			days: 80,
		});
		const t1Reject = t1Create.plus({
			days: 1,
		});

		// Transaction 2 (70 days ago): Bad - buyer ends
		const t2Create = DateTime.now().minus({
			days: 70,
		});
		const t2BuyerEnd = t2Create.plus({
			days: 3,
		});

		// Transaction 3 (40 days ago): Good - quick reaction and resolve
		const t3Create = DateTime.now().minus({
			days: 40,
		});
		const t3React = t3Create.plus({
			hours: 1,
		});
		const t3Resolve = t3React.plus({
			days: 1,
		});

		// Transaction 4 (20 days ago): Good - quick reaction and resolve
		const t4Create = DateTime.now().minus({
			days: 20,
		});
		const t4React = t4Create.plus({
			minutes: 30,
		});
		const t4Resolve = t4React.plus({
			days: 2,
		});

		// Transaction 5 (5 days ago): Good - very quick reaction, resolves
		const t5Create = DateTime.now().minus({
			days: 5,
		});
		const t5React = t5Create.plus({
			minutes: 15,
		});
		const t5Resolve = t5React.plus({
			days: 1,
		});

		// Transaction 6 (1 day ago): Good - quick reaction and resolve
		const t6Create = DateTime.now().minus({
			days: 1,
		});
		const t6React = t6Create.plus({
			hours: 2,
		});
		const t6Resolve = t6React.plus({
			days: 1,
		});

		const result = await Effect.gen(function* () {
			// Transaction 1: Bad - early period
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
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t1Reject;
					},
				}),
			);

			// Transaction 2: Bad - early period
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
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t2BuyerEnd;
					},
				}),
			);

			// Transaction 3: Good - recent period
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
				event: "transaction.open",
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

			// Transaction 4: Good - recent period
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
				scope: "user",
				source: "transaction",
				group: "tx-4",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t4React;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-4",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t4Resolve;
					},
				}),
			);

			// Transaction 5: Good - very recent
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
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t5React;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-5",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t5Resolve;
					},
				}),
			);

			// Transaction 6: Good - very recent
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
				event: "transaction.message",
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

		// Reaction: t1 has seller reaction (reject), t2 is terminal (buyer closed), t3-t6 all have reactions
		expect(result.reaction.total).toBe(6);
		expect(result.reaction.reactions).toBe(5); // t1 (reject), t3, t4, t5, t6
		expect(result.reaction.terminal).toBe(1); // t2 (buyer closed)
		expect(result.reaction.percent).toBe(100); // 5 + 1 = 6 out of 6

		// Rejected: 1 reject without interaction (t1)
		expect(result.rejected.total).toBe(6);
		expect(result.rejected.rejected).toBe(1); // t1
		expect(result.rejected.percent).toBeCloseTo(16.67, 1);

		// Resolved: 4 resolved (t3-t6)
		expect(result.resolved.total).toBe(6);
		expect(result.resolved.resolved).toBe(4); // t3, t4, t5, t6
		expect(result.resolved.terminal).toBe(2); // t1, t2
		expect(result.resolved.percent).toBeCloseTo(66.67, 1);

		// Expired: 0 expired
		expect(result.expired.total).toBe(6);
		expect(result.expired.expired).toBe(0);
		expect(result.expired.percent).toBe(0);

		// Activity: High (very recent activity - 1 day ago)
		expect(result.activity.bucket).toBe("high");

		// Score: Should be good (70+) due to recent good behavior
		expect(result.score.score).toBeGreaterThanOrEqual(70);
		expect(result.score.rank).toBeGreaterThanOrEqual(5);
	});
});
