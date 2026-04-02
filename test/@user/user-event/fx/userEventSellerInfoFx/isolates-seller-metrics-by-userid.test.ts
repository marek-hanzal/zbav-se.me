import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUserFx } from "~/test/user/fx/createUserFx";
import { seedUserEventTimelineFx } from "~/test/user-event/fx/seedUserEventTimelineFx";

describe("userEventSellerInfoFx", () => {
	it("isolates seller metrics by userId and does not mix other sellers' events", async () => {
		const database = await testabase("userEventSellerInfoFx-isolation");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const sellerA = yield* createUserFx({
				api,
				email: "seller-a-events@test.cz",
				name: "Seller A",
			});
			const sellerB = yield* createUserFx({
				api,
				email: "seller-b-events@test.cz",
				name: "Seller B",
			});

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
