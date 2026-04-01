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
	it("Activity buckets - low activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-low");

		const { api } = auth(() => {
			return database.dialect;
		});

		// Last user action: 75 days ago (should be low activity)
		// 60 <= 75 < 90 = low

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller3@test.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const sellerId = seller.id;

			// Create transaction (within cutoff)
			const createTime = DateTime.now().minus({
				days: 80,
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
						return createTime;
					},
				}),
			);

			// User action: 75 days ago
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return DateTime.now().minus({
							days: 75,
						});
					},
				}),
			);

			const result = yield* userEventSellerInfoFx({
				userId: sellerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			// Activity: 75 days ago in [60-90) tier = low
			expect(result.activity.bucket).toBe("low");
		}).pipe(withUserEventRuntimeFx(database), Effect.runPromise);
	});
});
