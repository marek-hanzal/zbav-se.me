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
	it("Activity buckets - high activity (recent user actions)", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-high");

		const { api } = auth(() => {
			return database.dialect;
		});

		// Last user action: 5 days ago (should be high activity)
		// Cutoff is 90 days, split into 3 tiers: [0-30), [30-60), [60-90)
		// 5 days < 30 days = high

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@test.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const sellerId = seller.id;

			// Create transaction (within cutoff)
			const createTime = DateTime.now().minus({
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
						return createTime;
					},
				}),
			);

			// User action: 5 days ago
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
							days: 5,
						});
					},
				}),
			);

			const result = yield* userEventSellerInfoFx({
				userId: sellerId,
			});

			expect(result).not.toBeNull();
			if (!result) return;

			// Activity: 5 days ago < 30 days tier = high
			expect(result.activity.bucket).toBe("high");
		}).pipe(withUserEventRuntimeFx(database), Effect.runPromise);
	});
});
