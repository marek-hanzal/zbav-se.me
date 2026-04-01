import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withUserEventRuntimeFx } from "~/test/utils/withUserEventRuntimeFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("Bad behaving buyer - instant closes, ghosts after open, and lets transactions expire", async () => {
		const database = await testabase("userEventBuyerInfoFx-bad-behaving-buyer");

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
			const base = DateTime.now().minus({
				days: 50,
			});
			const t1Create = base;
			const t1Open = t1Create.plus({
				hours: 1,
			});
			const t1SellerClose = t1Open.plus({
				hours: 1,
			});
			const t2Create = base.plus({
				days: 5,
			});
			const t2Open = t2Create.plus({
				minutes: 30,
			});
			const t2BuyerClose = t2Open.plus({
				minutes: 5,
			});
			const t3Create = base.plus({
				days: 10,
			});
			const t3Open = t3Create.plus({
				hours: 2,
			});
			const t3Expired = t3Open.plus({
				days: 7,
			});
			const t4Create = base.plus({
				days: 15,
			});
			const t4Open = t4Create.plus({
				minutes: 10,
			});
			const t4BuyerClose = t4Open.plus({
				minutes: 1,
			});

			// tx-1
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1Create,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1Open,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1SellerClose,
				}),
			);

			// tx-2
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
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2Open,
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
					now: () => t2BuyerClose,
				}),
			);

			// tx-3
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t3Create,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t3Open,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t3Expired,
				}),
			);

			// tx-4
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-4",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t4Create,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-4",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t4Open,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-4",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t4BuyerClose,
				}),
			);

			const result = yield* userEventBuyerInfoFx({
				userId: buyerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.reaction.total).toBe(4);
			expect(result.reaction.reactions).toBe(2);
			expect(result.reaction.terminal).toBe(1);
			expect(result.reaction.percent).toBe(75);
			expect(result.closer.total).toBe(4);
			expect(result.closer.closed).toBe(2);
			expect(result.closer.percent).toBe(50);
			expect(result.decision.total).toBe(4);
			expect(result.decision.decisions).toBe(2);
			expect(result.decision.terminal).toBe(1);
			expect(result.decision.percent).toBe(75);
			expect(result.expired.total).toBe(4);
			expect(result.expired.expired).toBe(1);
			expect(result.expired.percent).toBe(25);
			expect(result.score.score).toBeLessThan(60);
		}).pipe(withUserEventRuntimeFx(database), Effect.runPromise);
	});
});
