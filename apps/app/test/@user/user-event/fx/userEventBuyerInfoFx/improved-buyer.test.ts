import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/client/@seller/user-event/server/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/client/@user/user-event/server/fx/userEventCreateFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("userEventBuyerInfoFx", () => {
	it("Improved buyer - bad behavior earlier, good behavior recently", async () => {
		const database = await testabase("userEventBuyerInfoFx-improved-buyer");

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

		// Earlier (still within cutoff) bad-ish behavior
		const t1Create = DateTime.now().minus({
			days: 80,
		});
		const t1Open = t1Create.plus({
			hours: 1,
		});
		const t1Close = t1Open.plus({
			minutes: 2,
		}); // closer (no other interaction)

		const t2Create = DateTime.now().minus({
			days: 70,
		});
		const t2Open = t2Create.plus({
			hours: 2,
		});
		const t2Expired = t2Open.plus({
			days: 5,
		}); // ghosted -> expired

		// Recent good behavior
		const t3Create = DateTime.now().minus({
			days: 20,
		});
		const t3Open = t3Create.plus({
			minutes: 30,
		});
		const t3Msg = t3Open.plus({
			minutes: 10,
		});
		const t3Success = t3Msg.plus({
			days: 2,
		});

		const t4Create = DateTime.now().minus({
			days: 5,
		});
		const t4Open = t4Create.plus({
			minutes: 5,
		});
		const t4Msg = t4Open.plus({
			minutes: 5,
		});
		const t4Success = t4Msg.plus({
			days: 1,
		});

		const t5Create = DateTime.now().minus({
			days: 2,
		});
		const t5Open = t5Create.plus({
			minutes: 10,
		});
		const t5Msg = t5Open.plus({
			minutes: 10,
		});
		const t5Close = DateTime.now().minus({
			days: 1,
		});

		const result = await Effect.gen(function* () {
			// tx-1 closer
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
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1Close,
				}),
			);

			// tx-2 expired
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
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2Expired,
				}),
			);

			// tx-3 good
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
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t3Msg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.success",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t3Success,
				}),
			);

			// tx-4 good
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
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t4Msg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-4",
				event: "transaction.success",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t4Success,
				}),
			);

			// tx-5 good + recent activity
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
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t5Open,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-5",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t5Msg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-5",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t5Close,
				}),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.reaction.total).toBe(5);
		expect(result.closer.total).toBe(5);
		expect(result.decision.total).toBe(5);
		expect(result.expired.total).toBe(5);

		expect(result.activity.bucket).toBe("high");

		// Should be meaningfully better than "bad buyer" despite earlier issues.
		expect(result.score.score).toBeGreaterThanOrEqual(70);
		expect(result.score.rank).toBeGreaterThanOrEqual(5);
	});
});
