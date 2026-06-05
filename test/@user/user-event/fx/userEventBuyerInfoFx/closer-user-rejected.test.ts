import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateServiceFx } from "@/lib/common/date";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventBuyerInfoFx", () => {
	it("Closer: counts user transaction.rejected when no interaction happened (open is allowed)", async () => {
		const database = await testabase("userEventBuyerInfoFx-closer-user-rejected");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			const buyerId = buyer.id;
			const base = DateTime.now().minus({
				days: 10,
			});
			const t1Create = base;
			const t1Open = t1Create.plus({
				minutes: 10,
			});
			const t1Reject = t1Open.plus({
				minutes: 5,
			});
			const t2Create = base.plus({
				days: 1,
			});
			const t2Open = t2Create.plus({
				minutes: 10,
			});
			const t2Msg = t2Open.plus({
				minutes: 1,
			});
			const t2Reject = t2Msg.plus({
				minutes: 1,
			});

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateServiceFx, {
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
				Effect.provideService(DateServiceFx, {
					now: () => t1Open,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateServiceFx, {
					now: () => t1Reject,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateServiceFx, {
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
				Effect.provideService(DateServiceFx, {
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
				Effect.provideService(DateServiceFx, {
					now: () => t2Msg,
				}),
			);

			yield* userEventCreateFx({
				userId: buyerId,
				scope: "user",
				source: "transaction",
				group: "tx-2",
				event: "transaction.rejected",
				isTerminal: true,
			}).pipe(
				Effect.provideService(DateServiceFx, {
					now: () => t2Reject,
				}),
			);

			const result = yield* userEventBuyerInfoFx({
				userId: buyerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.closer.total).toBe(2);
			expect(result.closer.closed).toBe(1);
			expect(result.closer.percent).toBe(50);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
