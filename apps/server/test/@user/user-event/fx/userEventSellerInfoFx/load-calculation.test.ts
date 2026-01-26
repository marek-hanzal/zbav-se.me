import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@seller/user-event/fx/userEventSellerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "../../../../testabase";

describe("userEventSellerInfoFx", () => {
	it("Load calculation - active transactions without end events", async () => {
		const database = await testabase("userEventSellerInfoFx-load-calculation");

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

		// Base time: 90 days ago
		const baseTime = DateTime.now().minus({
			days: 90,
		});

		// Transaction 1: Active (created, no end) - counts as 1
		const t1Create = baseTime;

		// Transaction 2: Ended (created and closed) - doesn't count
		const t2Create = baseTime.plus({
			days: 10,
		});
		const t2Closed = t2Create.plus({
			days: 1,
		});

		// Transaction 3: Active (created, no end) - counts as 1
		const t3Create = baseTime.plus({
			days: 20,
		});

		// Transaction 4: Active (created, no end) - counts as 1
		const t4Create = baseTime.plus({
			days: 30,
		});

		// Transaction 5: Ended (created and rejected) - doesn't count
		const t5Create = baseTime.plus({
			days: 40,
		});
		const t5Rejected = t5Create.plus({
			days: 1,
		});

		// Total active: 3 (t1, t3, t4)
		// Load bucket: lowMax=1, mediumMax=3, so 3 active = medium

		const result = await Effect.gen(function* () {
			// Transaction 1: Active
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

			// Transaction 2: Ended
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
							return t2Closed;
						},
					}),
				),
			);

			// Transaction 3: Active
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

			// Transaction 4: Active
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

			// Transaction 5: Ended
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-5",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t5Create;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-5",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t5Rejected;
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

		// Load: 3 active transactions (t1, t3, t4)
		// lowMax=1, mediumMax=3, so 3 <= 3 = medium
		expect(result.load.bucket).toBe("medium");

		// Add one more active transaction to test high bucket
		// This would be 4 active, which is > 3, so high
	});

	it("Load calculation - high bucket with 4+ active transactions", async () => {
		const database = await testabase("userEventSellerInfoFx-load-calculation-high");

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

		const result = await Effect.gen(function* () {
			// Create 5 active transactions (no end events)
			for (let i = 0; i < 5; i++) {
				yield* userEventCreateFx({
					userId: sellerId,
					scope: "foreign",
					source: "transaction",
					group: `tx-${i}`,
					event: "transaction.create",
					isTerminal: false,
				}).pipe(
					Effect.provide(
						DateContextLayer({
							now() {
								return baseTime.plus({
									days: i * 10,
								});
							},
						}),
					),
				);
			}

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

		// Load: 5 active transactions > 3 = high
		expect(result.load.bucket).toBe("high");
	});
});
