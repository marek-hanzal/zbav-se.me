import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { createTransactionTimeline } from "~/test/user-event/fx/createTransactionTimeline";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventBuyerInfoFx", {
	timeout: 4_000,
}, () => {
	it("Closer: end after interaction should be dirty (not counted as instant close)", async () => {
		const database = await testabase("userEventBuyerInfoFx-closer-dirty");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});
			const base = DateTime.now().minus({
				days: 20,
			});
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
			const t3Create = base.plus({
				days: 2,
			});
			const t3Open = t3Create.plus({
				minutes: 30,
			});
			const t3Close = t3Open.plus({
				minutes: 1,
			});

			yield* seedUserEventTimelineFx({
				userId: buyer.id,
				events: [
					...createTransactionTimeline({
						group: "tx-1",
						steps: [
							{
								at: t1Create,
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: t1Open,
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: t1Msg,
								scope: "user",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: t1Close,
								scope: "user",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-2",
						steps: [
							{
								at: t2Create,
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: t2Open,
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: t2SellerMsg,
								scope: "foreign",
								event: "transaction.message",
								isTerminal: false,
							},
							{
								at: t2Close,
								scope: "user",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
					...createTransactionTimeline({
						group: "tx-3",
						steps: [
							{
								at: t3Create,
								scope: "user",
								event: "transaction.create",
								isTerminal: false,
							},
							{
								at: t3Open,
								scope: "foreign",
								event: "transaction.open",
								isTerminal: false,
							},
							{
								at: t3Close,
								scope: "user",
								event: "transaction.closed",
								isTerminal: true,
							},
						],
					}),
				],
			});

			const result = yield* userEventBuyerInfoFx({
				userId: buyer.id,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.closer.total).toBe(3);
			expect(result.closer.closed).toBe(1);
			expect(result.closer.percent).toBeCloseTo(33.33, 1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
