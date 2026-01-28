import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@seller-user/user-event/fx/userEventSellerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "../../../../testabase";

describe("userEventSellerInfoFx", () => {
	it("Bad behaving seller - rejects without interaction, no reactions, expired transactions", async () => {
		const database = await testabase("userEventSellerInfoFx-bad-behaving-seller");

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

		// Transaction 1: Seller rejects without interaction
		const t1Create = baseTime;
		const t1Reject = t1Create.plus({
			days: 1,
		});

		// Transaction 2: Seller never reacts, buyer ends
		const t2Create = baseTime.plus({
			days: 10,
		});
		const t2BuyerEnd = t2Create.plus({
			days: 5,
		});

		// Transaction 3: Transaction expires without seller action
		const t3Create = baseTime.plus({
			days: 20,
		});
		const t3Expired = t3Create.plus({
			days: 10,
		});

		// Transaction 4: Seller rejects without interaction
		const t4Create = baseTime.plus({
			days: 30,
		});
		const t4Reject = t4Create.plus({
			days: 2,
		});

		const result = await Effect.gen(function* () {
			// Transaction 1: Reject without interaction
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t1Create;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t1Reject;
						},
					}),
				),
			);

			// Transaction 2: Buyer ends before seller reacts
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t2Create;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t2BuyerEnd;
						},
					}),
				),
			);

			// Transaction 3: Expires without seller action
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t3Create;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t3Expired;
						},
					}),
				),
			);

			// Transaction 4: Reject without interaction
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-4",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t4Create;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-4",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t4Reject;
						},
					}),
				),
			);

			return yield* userEventSellerInfoFx({
				userId: sellerId,
			});
		}).pipe(
			Effect.provide(KyselyContextLayer(database)),
			Effect.provide(DateContextLayer(createDateContext())),
			Effect.runPromise,
		);

		expect(result).not.toBeNull();
		if (!result) return;

		// Reaction: t1 and t4 have seller reactions (rejects), t2 is terminal (buyer closed), t3 expired doesn't count
		expect(result.reaction.total).toBe(4);
		expect(result.reaction.reactions).toBe(2); // t1 and t4 (seller rejected)
		expect(result.reaction.terminal).toBe(1); // t2 (buyer closed before seller reacted)
		expect(result.reaction.percent).toBe(75); // 3 out of 4 (2 reactions + 1 terminal)

		// Rejected: 2 rejects without interaction
		expect(result.rejected.total).toBe(4);
		expect(result.rejected.rejected).toBe(2); // t1 and t4
		expect(result.rejected.percent).toBe(50);

		// Resolved: None resolved
		expect(result.resolved.total).toBe(4);
		expect(result.resolved.resolved).toBe(0);
		expect(result.resolved.terminal).toBe(3); // t1 (seller rejected), t2 (buyer closed), t4 (seller rejected)
		// t3 expires but doesn't count as terminal in resolved (expired is not buyer terminal)
		expect(result.resolved.percent).toBe(0);

		// Expired: 1 expired (t3)
		expect(result.expired.total).toBe(4);
		expect(result.expired.expired).toBe(1);
		expect(result.expired.percent).toBe(25);

		// Load: No active transactions
		expect(result.load.bucket).toBe("low");

		// Score: Should be low (< 40)
		expect(result.score.score).toBeLessThan(40);
		expect(result.score.rank).toBeLessThanOrEqual(3);
	});
});
