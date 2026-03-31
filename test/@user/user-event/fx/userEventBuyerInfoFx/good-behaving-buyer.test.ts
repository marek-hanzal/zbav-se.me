import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("Good behaving buyer - reacts after open, negotiates, and marks success", async () => {
		const database = await testabase("userEventBuyerInfoFx-good-behaving-buyer");

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

		// Ensure all events are within cutoff and activity is recent.
		const t1Create = DateTime.now().minus({
			days: 60,
		});
		const t1Open = t1Create.plus({
			hours: 1,
		});
		const t1React = t1Open.plus({
			minutes: 10,
		});
		const t1Success = t1React.plus({
			days: 1,
		});

		const t2Create = DateTime.now().minus({
			days: 30,
		});
		const t2Open = t2Create.plus({
			minutes: 30,
		});
		const t2React = t2Open.plus({
			minutes: 15,
		});
		const t2Success = t2React.plus({
			days: 2,
		});

		const t3Create = DateTime.now().minus({
			days: 2,
		});
		const t3Open = t3Create.plus({
			minutes: 5,
		});
		const t3React = t3Open.plus({
			minutes: 5,
		});
		const t3Success = DateTime.now().minus({
			days: 1,
		}); // recent activity

		const result = await Effect.gen(function* () {
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
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1React,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.success",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1Success,
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
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2React,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.success",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2Success,
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
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t3React,
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

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		// Reaction: 3 opens => 3 reactions via messages
		expect(result.reaction.total).toBe(3);
		expect(result.reaction.reactions).toBe(3);
		expect(result.reaction.terminal).toBe(0);
		expect(result.reaction.percent).toBe(100);
		expect(result.reaction.medianMs).toBeLessThanOrEqual(30 * 60 * 1000);

		// Closer: no "instant close" (we had messages before success => dirty)
		expect(result.closer.total).toBe(3);
		expect(result.closer.closed).toBe(0);
		expect(result.closer.percent).toBe(0);

		// Decision: buyer explicitly marked success on all
		expect(result.decision.total).toBe(3);
		expect(result.decision.decisions).toBe(3);
		expect(result.decision.terminal).toBe(0);
		expect(result.decision.percent).toBe(100);

		// Expired: none
		expect(result.expired.total).toBe(3);
		expect(result.expired.expired).toBe(0);
		expect(result.expired.percent).toBe(0);

		expect(result.load.bucket).toBe("low");
		expect(result.activity.bucket).toBe("high");

		expect(result.score.score).toBeGreaterThanOrEqual(80);
		expect(result.score.rank).toBeGreaterThanOrEqual(5);
	});
});
