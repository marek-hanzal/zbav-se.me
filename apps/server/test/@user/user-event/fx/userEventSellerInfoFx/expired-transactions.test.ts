import { createDateContext, DateContextLayer } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@seller-user/user-event/fx/userEventSellerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";
import { testabase } from "../../../../testabase";

describe("userEventSellerInfoFx", () => {
	it("Expired transactions - buyer pings, seller doesn't act, transaction expires", async () => {
		const database = await testabase("userEventSellerInfoFx-expired-transactions");

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

		// Base time: 89 days ago (within 90 day cutoff)
		const baseTime = DateTime.now().minus({
			days: 89,
		});

		// Transaction 1: Buyer creates, no seller action, expires
		const t1Create = baseTime;
		const t1Expired = t1Create.plus({
			days: 10,
		});

		// Transaction 2: Buyer creates, nudges with message, no seller action, expires
		const t2Create = baseTime.plus({
			days: 10,
		});
		const t2Message = t2Create.plus({
			days: 5,
		}); // Buyer nudges
		const t2Expired = t2Message.plus({
			days: 5,
		}); // Expires after last ping

		// Transaction 3: Buyer creates, seller acts, should not count as expired
		const t3Create = baseTime.plus({
			days: 20,
		});
		const t3SellerMessage = t3Create.plus({
			days: 2,
		});
		const t3Expired = t3SellerMessage.plus({
			days: 5,
		}); // Expires but seller acted

		const result = await Effect.gen(function* () {
			// Transaction 1: Expires without seller action
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
						now() {
							return t1Create;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t1Expired;
						},
					}),
				),
			);

			// Transaction 2: Buyer nudges, then expires
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
						now() {
							return t2Create;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t2Message;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t2Expired;
						},
					}),
				),
			);

			// Transaction 3: Seller acts, then expires (should not count)
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t3Create;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-3",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t3SellerMessage;
						},
					}),
				),
			);

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-3",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provide(
					DateContextLayer({
						now() {
							return t3Expired;
						},
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

		// Expired: 2 expired without seller action (t1, t2)
		// t3 has seller action before expire, so doesn't count
		expect(result.expired.total).toBe(3);
		expect(result.expired.expired).toBe(2); // t1 and t2
		expect(result.expired.percent).toBeCloseTo(66.67, 1);
	});
});
