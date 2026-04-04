import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventBuyerInfoFx } from "~/seller/user-event/server/fx/userEventBuyerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventBuyerInfoFx", () => {
	it("Reaction: seller terminal before open counts as terminal reaction", async () => {
		const database = await testabase("userEventBuyerInfoFx-reaction-terminal-before-open");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});

			const buyerId = buyer.id;
			const tCreate = DateTime.now().minus({
				days: 10,
			});
			const tSellerClose = tCreate.plus({
				hours: 1,
			});
			const t2Create = DateTime.now().minus({
				days: 9,
			});
			const t2SellerReject = t2Create.plus({
				hours: 1,
			});

			yield* seedUserEventTimelineFx({
				userId: buyerId,
				events: [
					{
						at: tCreate,
						group: "tx-1",
						scope: "user",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: tSellerClose,
						group: "tx-1",
						scope: "foreign",
						source: "transaction",
						event: "transaction.closed",
						isTerminal: true,
					},
					{
						at: t2Create,
						group: "tx-2",
						scope: "user",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: t2SellerReject,
						group: "tx-2",
						scope: "foreign",
						source: "transaction",
						event: "transaction.rejected",
						isTerminal: true,
					},
				],
			});

			const result = yield* userEventBuyerInfoFx({
				userId: buyerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			expect(result.reaction.total).toBe(2);
			expect(result.reaction.reactions).toBe(0);
			expect(result.reaction.terminal).toBe(2);
			expect(result.reaction.percent).toBe(100);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
