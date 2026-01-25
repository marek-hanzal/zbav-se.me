import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { userEventSellerInfoFx } from "~/@user/user-event/fx/userEventSellerInfoFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "../../../../testabase";

describe("userEventSellerInfoFx", () => {
	it("Activity buckets - high activity (recent user actions)", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-high");

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

		// Last user action: 5 days ago (should be high activity)
		// Cutoff is 90 days, split into 3 tiers: [0-30), [30-60), [60-90)
		// 5 days < 30 days = high

		const result = await Effect.gen(function* () {
			// Create transaction (within cutoff)
			const createTime = DateTime.now().minus({
				days: 10,
			});

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
							return createTime;
						},
					}),
				),
			);

			// User action: 5 days ago
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return DateTime.now().minus({
								days: 5,
							});
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

		// Activity: 5 days ago < 30 days tier = high
		expect(result.activity.bucket).toBe("high");
	});

	it("Activity buckets - medium activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-medium");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller2@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;

		// Last user action: 45 days ago (should be medium activity)
		// 30 <= 45 < 60 = medium

		const result = await Effect.gen(function* () {
			// Create transaction (within cutoff)
			const createTime = DateTime.now().minus({
				days: 50,
			});

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
							return createTime;
						},
					}),
				),
			);

			// User action: 45 days ago
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
							return DateTime.now().minus({
								days: 45,
							});
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

		// Activity: 45 days ago in [30-60) tier = medium
		expect(result.activity.bucket).toBe("medium");
	});

	it("Activity buckets - low activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-low");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller3@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;

		// Last user action: 75 days ago (should be low activity)
		// 60 <= 75 < 90 = low

		const result = await Effect.gen(function* () {
			// Create transaction (within cutoff)
			const createTime = DateTime.now().minus({
				days: 80,
			});

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
							return createTime;
						},
					}),
				),
			);

			// User action: 75 days ago
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return DateTime.now().minus({
								days: 75,
							});
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

		// Activity: 75 days ago in [60-90) tier = low
		expect(result.activity.bucket).toBe("low");
	});

	it("Activity buckets - no user activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-none");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller4@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;

		// No user scope events = low activity

		const result = await Effect.gen(function* () {
			// Create two transactions (need > 1 event) with only foreign events (buyer creates)
			const createTime1 = DateTime.now().minus({
				days: 10,
			});

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
							return createTime1;
						},
					}),
				),
			);

			const createTime2 = DateTime.now().minus({
				days: 20,
			});

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
							return createTime2;
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

		// Activity: No user events = low
		expect(result.activity.bucket).toBe("low");
	});
});
