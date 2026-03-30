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
	it("Expired: buyer action after seller ping disqualifies from expired", async () => {
		const database = await testabase("userEventBuyerInfoFx-expired-disqualify");

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

		// tx-1: seller opens (ping), buyer responds, seller expires -> should NOT count as expired
		const t1Create = base;
		const t1Open = t1Create.plus({
			hours: 1,
		});
		const t1BuyerMsg = t1Open.plus({
			minutes: 10,
		});
		const t1Expired = t1BuyerMsg.plus({
			days: 5,
		});

		// tx-2: seller opens (ping), buyer never responds, seller expires -> expired++
		const t2Create = base.plus({
			days: 1,
		});
		const t2Open = t2Create.plus({
			hours: 1,
		});
		const t2Expired = t2Open.plus({
			days: 5,
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
					now: () => t1BuyerMsg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.expired",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1Expired,
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

			return yield* userEventBuyerInfoFx({
				userId: buyerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		expect(result.expired.total).toBe(2);
		expect(result.expired.expired).toBe(1); // only tx-2
		expect(result.expired.percent).toBe(50);
	});
});
