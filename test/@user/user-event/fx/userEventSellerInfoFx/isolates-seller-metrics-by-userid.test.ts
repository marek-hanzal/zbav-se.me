import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventSellerInfoFx", () => {
	it("isolates seller metrics by userId and does not mix other sellers' events", async () => {
		const database = await testabase("userEventSellerInfoFx-isolation");

		return Effect.gen(function* () {
			const sellerA = yield* leaseTestUserFx({});
			const sellerB = yield* leaseTestUserFx({});

			yield* seedUserEventTimelineFx({
				userId: sellerA.id,
				events: [
					{
						at: DateTime.now().minus({
							days: 10,
						}),
						group: "seller-a-group",
						scope: "foreign",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
					{
						at: DateTime.now().minus({
							days: 9,
						}),
						group: "seller-a-group",
						scope: "user",
						source: "transaction",
						event: "transaction.open",
						isTerminal: false,
					},
				],
			});

			yield* seedUserEventTimelineFx({
				userId: sellerB.id,
				events: [
					{
						at: DateTime.now().minus({
							days: 8,
						}),
						group: "seller-b-group",
						scope: "foreign",
						source: "transaction",
						event: "transaction.create",
						isTerminal: false,
					},
				],
			});

			const sellerAInfo = yield* userEventSellerInfoFx({
				userId: sellerA.id,
			});
			const sellerBInfo = yield* userEventSellerInfoFx({
				userId: sellerB.id,
			});

			expect(sellerAInfo).not.toBeNull();
			expect(sellerAInfo?.reaction.total).toBe(1);
			expect(sellerBInfo).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
