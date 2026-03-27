import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/client/@buyer/user-event/server/fx/userEventSellerInfoFx";
import { userEventCreateFx } from "~/client/@user/user-event/server/fx/userEventCreateFx";
import { auth } from "~/server/auth/auth";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("userEventSellerInfoFx", () => {
	it("Activity buckets - medium activity", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-medium");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller2@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;

		// Last user action: 45 days ago (should be medium activity)
		// 30 <= 45 < 60 = medium

		const result = await Effect.gen(function* () {
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

			return yield* userEventSellerInfoFx({
				userId: sellerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		// Activity: 45 days ago in [30-60) tier = medium
		expect(result.activity.bucket).toBe("medium");
	});
});
