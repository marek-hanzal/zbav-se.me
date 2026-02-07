import { DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/@buyer-session/user-event/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { testabase } from "~test/testabase";

describe("userEventBuyerInfoFx", () => {
	it("Activity buckets - high activity (recent user actions)", async () => {
		const database = await testabase("userEventBuyerInfoFx-activity-high");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@test.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const buyerId = buyer.id;

		const result = await Effect.gen(function* () {
			const createTime = DateTime.now().minus({
				days: 10,
			});
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => createTime,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
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
								days: 5,
							});
						},
					}),
				),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.scoped, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.activity.bucket).toBe("high");
	});

	it("Activity buckets - medium activity", async () => {
		const database = await testabase("userEventBuyerInfoFx-activity-medium");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@test.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const buyerId = buyer.id;

		const result = await Effect.gen(function* () {
			const createTime = DateTime.now().minus({
				days: 50,
			});
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => createTime,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
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

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.scoped, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.activity.bucket).toBe("medium");
	});

	it("Activity buckets - low activity", async () => {
		const database = await testabase("userEventBuyerInfoFx-activity-low");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@test.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const buyerId = buyer.id;

		const result = await Effect.gen(function* () {
			const createTime = DateTime.now().minus({
				days: 80,
			});
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => createTime,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
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
								days: 75,
							});
						},
					}),
				),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.scoped, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.activity.bucket).toBe("low");
	});

	it("Activity buckets - no user activity", async () => {
		const database = await testabase("userEventBuyerInfoFx-activity-none");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@test.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const buyerId = buyer.id;

		const result = await Effect.gen(function* () {
			// foreign events only (still > 1 event overall so fx doesn't return null)
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () =>
							DateTime.now().minus({
								days: 10,
							}),
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () =>
							DateTime.now().minus({
								days: 20,
							}),
					}),
				),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.scoped, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.activity.bucket).toBe("low");
	});
});
