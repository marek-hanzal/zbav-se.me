import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withUserEventRuntimeFx } from "~/test/utils/withUserEventRuntimeFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Activity buckets - no user activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-none");

		const { api } = auth(() => {
			return database.dialect;
		});

		// No user scope events = low activity

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller4@test.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const sellerId = seller.id;

			// Create two transactions (need > 1 event) with only foreign events (buyer creates)
			const createTime1 = DateTime.now().minus({
				days: 10,
			});

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-1",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return createTime1;
					},
				}),
			);

			const createTime2 = DateTime.now().minus({
				days: 20,
			});

			yield* userEventCreateFx({
				userId: sellerId,
				scope: "foreign",
				source: "transaction",
				group: "tx-2",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return createTime2;
					},
				}),
			);

			const result = yield* userEventSellerInfoFx({
				userId: sellerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			// Activity: No user events = low
			expect(result.activity.bucket).toBe("low");
		}).pipe(withUserEventRuntimeFx(database), Effect.runPromise);
	});
});
