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
	it("Good behaving seller - reacts quickly and resolves transactions", async () => {
		const database = await testabase("userEventSellerInfoFx-good-behaving-seller");

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

		// Transaction 1: Seller reacts within 1 hour and resolves
		const t1Create = baseTime;
		const t1React = t1Create.plus({
			hours: 1,
		});
		const t1Resolve = t1React.plus({
			days: 1,
		});

		// Transaction 2: Seller reacts within 30 minutes and resolves
		const t2Create = baseTime.plus({
			days: 10,
		});
		const t2React = t2Create.plus({
			minutes: 30,
		});
		const t2Resolve = t2React.plus({
			days: 2,
		});

		// Transaction 3: Seller reacts within 2 hours and resolves
		const t3Create = baseTime.plus({
			days: 20,
		});
		const t3React = t3Create.plus({
			hours: 2,
		});
		const t3Resolve = t3React.plus({
			days: 1,
		});

		const result = await Effect.gen(function* () {
			// Transaction 1
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

			// Transaction 2
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
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t2React;
					},
				}),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return t2Resolve;
					},
				}),
			);

			// Transaction 3
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

			return yield* userEventSellerInfoFx({
				userId: sellerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		// Reaction: All 3 transactions should have reactions, median around 1 hour
		expect(result.reaction.total).toBe(3);
		expect(result.reaction.reactions).toBe(3);
		expect(result.reaction.terminal).toBe(0);
		expect(result.reaction.percent).toBe(100);
		expect(result.reaction.medianMs).toBeLessThan(2 * 60 * 60 * 1000); // Less than 2 hours

		// Rejected: No rejects without interaction
		expect(result.rejected.total).toBe(3);
		expect(result.rejected.rejected).toBe(0);
		expect(result.rejected.percent).toBe(0);

		// Resolved: All 3 resolved
		expect(result.resolved.total).toBe(3);
		expect(result.resolved.resolved).toBe(3);
		expect(result.resolved.terminal).toBe(0);
		expect(result.resolved.percent).toBe(100);

		// Expired: None expired
		expect(result.expired.total).toBe(3);
		expect(result.expired.expired).toBe(0);
		expect(result.expired.percent).toBe(0);

		// Load: No active transactions
		expect(result.load.bucket).toBe("low");

		// Activity: Low (activity was 90 days ago)
		expect(result.activity.bucket).toBe("low");

		// Score: Should be high (80+)
		expect(result.score.score).toBeGreaterThan(80);
		expect(result.score.rank).toBeGreaterThanOrEqual(5);
	});
});
