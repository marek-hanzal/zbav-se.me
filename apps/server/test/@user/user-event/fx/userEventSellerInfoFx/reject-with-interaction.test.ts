import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@seller-session/user-event/fx/userEventSellerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "~test/testabase";

describe("userEventSellerInfoFx", () => {
	it("Seller rejects after interaction - should not count as rejected without interaction", async () => {
		const database = await testabase("userEventSellerInfoFx-reject-with-interaction");

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

		const result = await Effect.gen(function* () {
			// Transaction 1: Reject after message
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
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t1Message;
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

			// Transaction 2: Reject after open
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
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t2Open;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t2Reject;
						},
					}),
				),
			);

			// Transaction 3: Reject without interaction
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
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t3Reject;
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

		// Rejected: Only t3 should count (rejected without interaction)
		// t1 and t2 have interactions before reject, so they're dirty
		expect(result.rejected.total).toBe(3);
		expect(result.rejected.rejected).toBe(1); // Only t3
		expect(result.rejected.percent).toBeCloseTo(33.33, 1);

		// All three should have reactions (all rejected, which counts as reaction)
		expect(result.reaction.total).toBe(3);
		expect(result.reaction.reactions).toBe(3); // All three have reactions (reject events)
		expect(result.reaction.terminal).toBe(0);
	});
});
