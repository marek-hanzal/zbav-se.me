import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("Expired: counts foreign transaction.resolved when buyer did not act after seller ping", async () => {
		const database = await testabase("userEventBuyerInfoFx-expired-resolved-foreign");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			const buyerId = buyer.id;
			const base = DateTime.now().minus({
				days: 25,
			});
			const t1Create = base;
			const t1Open = t1Create.plus({
				hours: 1,
			});
			const t1Resolved = t1Open.plus({
				days: 3,
			});
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
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t1Resolved,
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
					now: () => t2BuyerMsg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.resolved",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now: () => t2Resolved,
				}),
			);

			const result = yield* userEventBuyerInfoFx({
				userId: buyerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.expired.total).toBe(2);
			expect(result.expired.expired).toBe(1);
			expect(result.expired.percent).toBe(50);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
