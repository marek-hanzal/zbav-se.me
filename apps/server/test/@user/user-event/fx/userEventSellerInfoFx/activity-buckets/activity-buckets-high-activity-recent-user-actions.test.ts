import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { userEventSellerInfoFx } from "~/@buyer/user-event/fx/userEventSellerInfoFx";
import { userEventCreateFx } from "~/@user/user-event/fx/userEventCreateFx";
import { auth } from "~/auth/auth";
import { withDateFx } from "~/database/fx/withDateFx";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { testabase } from "~test/testabase";
import { withTestRuntimeFx } from "~test/withTestRuntimeFx";

describe("userEventSellerInfoFx", () => {
	it("Activity buckets - high activity (recent user actions)", async () => {
		const database = await testabase("userEventSellerInfoFx-activity-high");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@test.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const sellerId = seller.id;

		// Last user action: 5 days ago (should be high activity)
		// Cutoff is 90 days, split into 3 tiers: [0-30), [30-60), [60-90)
		// 5 days < 30 days = high

		const result = await Effect.gen(function* () {
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

			return yield* userEventSellerInfoFx({
				userId: sellerId,
			});
		}).pipe(withKyselyFx(database), withDateFx, withTestRuntimeFx, Effect.runPromise);

		expect(result).not.toBeNull();
		if (!result) return;

		// Activity: 5 days ago < 30 days tier = high
		expect(result.activity.bucket).toBe("high");
	});
});
