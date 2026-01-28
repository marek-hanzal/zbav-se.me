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
	it("Expired: counts foreign transaction.resolved when buyer did not act after seller ping", async () => {
		const database = await testabase("userEventBuyerInfoFx-expired-resolved-foreign");

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
			days: 25,
		});

		// tx-1: seller opens (ping), buyer does nothing, seller ends as "resolved" -> expired++
		const t1Create = base;
		const t1Open = t1Create.plus({
			hours: 1,
		});
		const t1Resolved = t1Open.plus({
			days: 3,
		});

		// tx-2: seller opens (ping), buyer reacts, seller ends as "resolved" -> NOT expired
		const t2Create = base.plus({
			days: 1,
		});
		const t2Open = t2Create.plus({
			hours: 1,
		});
		const t2BuyerMsg = t2Open.plus({
			minutes: 5,
		});
		const t2Resolved = t2BuyerMsg.plus({
			days: 3,
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
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t1Resolved,
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
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t2BuyerMsg,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t2Resolved,
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

		expect(result.expired.total).toBe(2);
		expect(result.expired.expired).toBe(1);
		expect(result.expired.percent).toBe(50);
	});
});
