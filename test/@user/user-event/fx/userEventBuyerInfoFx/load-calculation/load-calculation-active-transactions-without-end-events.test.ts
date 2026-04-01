import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("Load calculation - active transactions without end events", async () => {
		const database = await testabase("userEventBuyerInfoFx-load-calculation");

		const { api } = auth(() => {
			return database.dialect;
		});

		return Effect.gen(function* () {
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@test.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const buyerId = buyer.id;
			const baseTime = DateTime.now().minus({
				days: 30,
			});

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

			const result = yield* userEventBuyerInfoFx({
				userId: buyerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.load.bucket).toBe("medium");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
