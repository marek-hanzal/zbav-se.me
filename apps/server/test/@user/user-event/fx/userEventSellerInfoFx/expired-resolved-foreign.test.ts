import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@buyer-session/user-event/fx/userEventSellerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "~test/testabase";

describe("userEventSellerInfoFx", () => {
	it("Expired: counts foreign transaction.resolved when seller did not act after buyer ping", async () => {
		const database = await testabase("userEventSellerInfoFx-expired-resolved-foreign");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;
		const base = DateTime.now().minus({
			days: 20,
		});

		// tx-1: buyer create (ping), no seller action, buyer ends as "resolved" -> expired++
		const t1Create = base;
		const t1Resolved = t1Create.plus({
			days: 2,
		});

		// tx-2: buyer create (ping), seller acts (message) after ping, buyer ends as "resolved" -> NOT expired
		const t2Create = base.plus({
			days: 1,
		});
		const t2SellerMessage = t2Create.plus({
			hours: 1,
		});
		const t2Resolved = t2SellerMessage.plus({
			days: 2,
		});

		const result = await Effect.gen(function* () {
			// tx-1
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
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
				userId: sellerId,
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
				userId: sellerId,
				scope: "foreign",
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
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now: () => t2SellerMessage,
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
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

			return yield* userEventSellerInfoFx({
				userId: sellerId,
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
