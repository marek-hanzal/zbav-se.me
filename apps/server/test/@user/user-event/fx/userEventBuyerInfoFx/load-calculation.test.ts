import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/@buyer/user-event/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { testabase } from "~test/testabase";
import { withTestRuntimeFx } from "~test/withTestRuntimeFx";

describe("userEventBuyerInfoFx", () => {
	it("Load calculation - active transactions without end events", async () => {
		const database = await testabase("userEventBuyerInfoFx-load-calculation");

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
		const baseTime = DateTime.now().minus({
			days: 30,
		});

		const result = await Effect.gen(function* () {
			// Active: tx-1 (create only)
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => baseTime,
				}),
			);

			// Ended: tx-2 (create + closed)
			const t2Create = baseTime.plus({
				days: 1,
			});
			const t2Close = t2Create.plus({
				days: 1,
			});
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2Create,
				}),
			);
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2Close,
				}),
			);

			// Active: tx-3 (create only)
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						baseTime.plus({
							days: 2,
						}),
				}),
			);

			// Active: tx-4 (create only)
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-4",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () =>
						baseTime.plus({
							days: 3,
						}),
				}),
			);

			// Ended: tx-5 (create + expired foreign)
			const t5Create = baseTime.plus({
				days: 4,
			});
			const t5Expired = t5Create.plus({
				days: 3,
			});
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-5",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t5Create,
				}),
			);
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-5",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t5Expired,
				}),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, withTestRuntimeFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		// Active: tx-1, tx-3, tx-4 => 3 => medium (lowMax=1, mediumMax=3)
		expect(result.load.bucket).toBe("medium");
	});

	it("Load calculation - high bucket with 4+ active transactions", async () => {
		const database = await testabase("userEventBuyerInfoFx-load-calculation-high");

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
		const baseTime = DateTime.now().minus({
			days: 30,
		});

		const result = await Effect.gen(function* () {
			// 5 active transactions (create only)
			for (let i = 0; i < 5; i++) {
				yield* userEventCreateFx({
					userId: buyerId,
					scope: "user",
					source: "transaction",
					group: `tx-${i}`,
					event: "transaction.create",
					isTerminal: false,
				}).pipe(
					Effect.provideService(DateContextFx, {
						now() {
							return baseTime.plus({
								days: i,
							});
						},
					}),
				);
			}

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, withTestRuntimeFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.load.bucket).toBe("high");
	});
});
