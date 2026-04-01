import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { userEventSellerInfoFx } from "~/buyer/user-event/server/fx/userEventSellerInfoFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

describe("userEventSellerInfoFx", () => {
	it("Activity buckets - medium activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-medium");

		const { api } = auth(() => {
			return database.dialect;
		});

		// Last user action: 45 days ago (should be medium activity)
		// 30 <= 45 < 60 = medium

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller2@test.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const sellerId = seller.id;

			// Create transaction (within cutoff)
			const createTime = DateTime.now().minus({
				days: 50,
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

			// User action: 45 days ago
			yield* userEventCreateFx({
				userId: sellerId,
				scope: "user",
				source: "transaction",
				group: "tx-1",
				event: "transaction.message",
				isTerminal: false,
			}).pipe(
				Effect.provideService(DateContextFx, {
					now() {
						return DateTime.now().minus({
							days: 45,
						});
					},
				}),
			);

			const result = yield* userEventSellerInfoFx({
				userId: sellerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			// Activity: 45 days ago in [30-60) tier = medium
			expect(result.activity.bucket).toBe("medium");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
