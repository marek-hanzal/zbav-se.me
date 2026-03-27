import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/server/@seller/user-event/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/server/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("userEventBuyerInfoFx", () => {
	it("Mixed behavior - combo of good and bad buyer behaviors", async () => {
		const database = await testabase("userEventBuyerInfoFx-mixed-behavior");

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
		const base = DateTime.now().minus({
			days: 40,
		});

		// tx-1: good (open -> message -> success)
		const t1Create = base;
		const t1Open = t1Create.plus({
			hours: 1,
		});
		const t1Msg = t1Open.plus({
			minutes: 10,
		});
		const t1Success = t1Msg.plus({
			days: 1,
		});

		// tx-2: closer (open allowed, buyer closes without other interaction)
		const t2Create = base.plus({
			days: 2,
		});
		const t2Open = t2Create.plus({
			minutes: 30,
		});
		const t2Close = t2Open.plus({
			minutes: 5,
		});

		// tx-3: terminal by seller (open -> seller reject)
		const t3Create = base.plus({
			days: 4,
		});
		const t3Open = t3Create.plus({
			minutes: 10,
		});
		const t3Reject = t3Open.plus({
			hours: 1,
		});

		// tx-4: expired (open -> expired, no buyer action)
		const t4Create = base.plus({
			days: 6,
		});
		const t4Open = t4Create.plus({
			hours: 2,
		});
		const t4Expired = t4Open.plus({
			days: 3,
		});

		// tx-5: good (open -> message -> success)
		const t5Create = base.plus({
			days: 8,
		});
		const t5Open = t5Create.plus({
			minutes: 15,
		});
		const t5Msg = t5Open.plus({
			minutes: 15,
		});
		const t5Success = t5Msg.plus({
			days: 2,
		});

		// tx-6: good, explicit close (recent)
		const t6Create = DateTime.now().minus({
			days: 2,
		});
		const t6Open = t6Create.plus({
			minutes: 5,
		});
		const t6Msg = t6Open.plus({
			minutes: 5,
		});
		const t6Close = DateTime.now().minus({
			days: 1,
		});

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
					now: () => t1Msg,
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
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2Close,
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
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t3Reject,
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
				scope: "foreign",
				source: "transaction",
				group: "tx-4",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t4Expired,
				}),
			);

			// tx-5
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
				event: "transaction.success",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t5Success,
				}),
			);

			// tx-6
			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-6",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t6Create,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-6",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t6Open,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-6",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t6Msg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-6",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t6Close,
				}),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.reaction.total).toBe(6);
		expect(result.reaction.reactions).toBe(4); // tx-1, tx-2, tx-5, tx-6
		expect(result.reaction.terminal).toBe(1); // tx-3
		expect(result.reaction.percent).toBeCloseTo(83.33, 1);

		expect(result.closer.total).toBe(6);
		expect(result.closer.closed).toBe(1); // tx-2 only
		expect(result.closer.percent).toBeCloseTo(16.67, 1);

		expect(result.decision.total).toBe(6);
		expect(result.decision.decisions).toBe(4); // tx-1, tx-2, tx-5, tx-6
		expect(result.decision.terminal).toBe(1); // tx-3
		expect(result.decision.percent).toBeCloseTo(83.33, 1);

		expect(result.expired.total).toBe(6);
		expect(result.expired.expired).toBe(1); // tx-4
		expect(result.expired.percent).toBeCloseTo(16.67, 1);

		expect(result.load.bucket).toBe("low");
		expect(result.activity.bucket).toBe("high");

		expect(result.score.score).toBeGreaterThanOrEqual(40);
		expect(result.score.score).toBeLessThan(85);
	});
});
