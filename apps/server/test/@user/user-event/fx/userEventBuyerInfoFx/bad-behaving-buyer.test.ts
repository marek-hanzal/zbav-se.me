import { DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/@buyer/user-event/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { testabase } from "~test/testabase";
import { withTestAxiomFx } from "~test/withTestAxiomFx";

describe("userEventBuyerInfoFx", () => {
	it("Bad behaving buyer - instant closes, ghosts after open, and lets transactions expire", async () => {
		const database = await testabase("userEventBuyerInfoFx-bad-behaving-buyer");

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
			days: 50,
		});

		// tx-1: seller opens, then seller closes before buyer reacts -> reaction terminal
		const t1Create = base;
		const t1Open = t1Create.plus({
			hours: 1,
		});
		const t1SellerClose = t1Open.plus({
			hours: 1,
		});

		// tx-2: buyer closes without interaction (open is allowed) -> closer.closed++
		const t2Create = base.plus({
			days: 5,
		});
		const t2Open = t2Create.plus({
			minutes: 30,
		});
		const t2BuyerClose = t2Open.plus({
			minutes: 5,
		});

		// tx-3: seller opens, buyer never acts, seller expires -> expired++
		const t3Create = base.plus({
			days: 10,
		});
		const t3Open = t3Create.plus({
			hours: 2,
		});
		const t3Expired = t3Open.plus({
			days: 7,
		});

		// tx-4: buyer closes without interaction again -> closer.closed++
		const t4Create = base.plus({
			days: 15,
		});
		const t4Open = t4Create.plus({
			minutes: 10,
		});
		const t4BuyerClose = t4Open.plus({
			minutes: 1,
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
				Effect.provide(
					DateContextLayer({
						now: () => t1Create,
					}),
				),
			);

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
						now: () => t1Open,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t1SellerClose,
					}),
				),
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
				Effect.provide(
					DateContextLayer({
						now: () => t2Create,
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
						now: () => t2Open,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t2BuyerClose,
					}),
				),
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
				Effect.provide(
					DateContextLayer({
						now: () => t3Create,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t3Open,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t3Expired,
					}),
				),
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
				Effect.provide(
					DateContextLayer({
						now: () => t4Create,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-4",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t4Open,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-4",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t4BuyerClose,
					}),
				),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(
			withKyselyFx(database),
			withDateFx,
			withTestAxiomFx,
			Effect.scoped,
			Effect.runPromise,
		);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.reaction.total).toBe(4);
		expect(result.reaction.reactions).toBe(2); // tx-2, tx-4 (buyer closed after open)
		expect(result.reaction.terminal).toBe(1); // tx-1 (seller closed)
		expect(result.reaction.percent).toBe(75); // (2 + 1) / 4

		expect(result.closer.total).toBe(4);
		expect(result.closer.closed).toBe(2); // tx-2, tx-4 (no interactions besides open)
		expect(result.closer.percent).toBe(50);

		expect(result.decision.total).toBe(4);
		expect(result.decision.decisions).toBe(2); // tx-2, tx-4 (buyer closed)
		expect(result.decision.terminal).toBe(1); // tx-1 (seller closed)
		expect(result.decision.percent).toBe(75);

		expect(result.expired.total).toBe(4);
		expect(result.expired.expired).toBe(1); // tx-3
		expect(result.expired.percent).toBe(25);

		expect(result.score.score).toBeLessThan(60);
	});
});
