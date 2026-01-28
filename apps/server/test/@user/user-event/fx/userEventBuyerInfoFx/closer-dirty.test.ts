import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/@buyer-user/user-event/fx/userEventBuyerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "../../../../testabase";

describe("userEventBuyerInfoFx", () => {
	it("Closer: end after interaction should be dirty (not counted as instant close)", async () => {
		const database = await testabase("userEventBuyerInfoFx-closer-dirty");

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
			days: 20,
		});

		// tx-1: buyer message before close => dirty
		const t1Create = base;
		const t1Open = t1Create.plus({
			hours: 1,
		});
		const t1Msg = t1Open.plus({
			minutes: 10,
		});
		const t1Close = t1Msg.plus({
			minutes: 5,
		});

		// tx-2: seller message before buyer end => dirty
		const t2Create = base.plus({
			days: 1,
		});
		const t2Open = t2Create.plus({
			hours: 1,
		});
		const t2SellerMsg = t2Open.plus({
			minutes: 2,
		});
		const t2Close = t2SellerMsg.plus({
			minutes: 10,
		});

		// tx-3: only open between create and close => not dirty => counts
		const t3Create = base.plus({
			days: 2,
		});
		const t3Open = t3Create.plus({
			minutes: 30,
		});
		const t3Close = t3Open.plus({
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
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t1Msg,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t1Close,
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
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t2SellerMsg,
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
						now: () => t2Close,
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
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.closed",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t3Close,
					}),
				),
			);

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(
			Effect.provide(KyselyContextLayer(database)),
			Effect.provide(DateContextLayer(createDateContext())),
			Effect.runPromise,
		);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.closer.total).toBe(3);
		expect(result.closer.closed).toBe(1); // only tx-3
		expect(result.closer.percent).toBeCloseTo(33.33, 1);
	});
});
